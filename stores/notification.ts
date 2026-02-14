import { defineStore } from "pinia";

/* =========================
 * TYPES
 ========================= */
export interface Notification {
	id: string;
	type: string;
	data: {
		title?: string;
		message?: string;
		commande_id?: string;
		livre_id?: string;
		stock?: number;
	};
	read_at: string | null;
	created_at: string;
}

/* =========================
 * STORE
 ========================= */
export const useNotificationStore = defineStore("notification", {
	/* =========================
   * STATE
   ========================= */
	state: () => ({
		notifications: [] as Notification[],
		unreadCount: 0,
		loading: false,
	}),

	/* =========================
   * GETTERS
   ========================= */
	getters: {
		isLoading: (state) => state.loading,

		unreadNotifications: (state) =>
			state.notifications.filter((n) => !n.read_at),

		unreadCount: (state) =>
			state.notifications.filter((n) => !n.read_at).length,

		groupedNotifications: (state) => {
			const now = new Date();

			const startOfToday = new Date();
			startOfToday.setHours(0, 0, 0, 0);

			const startOfYesterday = new Date(startOfToday);
			startOfYesterday.setDate(startOfToday.getDate() - 1);

			const startOfWeek = new Date(startOfToday);
			startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());

			const startOfLastWeek = new Date(startOfWeek);
			startOfLastWeek.setDate(startOfWeek.getDate() - 7);

			const endOfLastWeek = new Date(startOfWeek);
			endOfLastWeek.setMilliseconds(-1);

			const groups = {
				today: [] as Notification[],
				yesterday: [] as Notification[],
				thisWeek: [] as Notification[],
				lastWeek: [] as Notification[],
				old: [] as Notification[],
			};

			state.notifications.forEach((notif) => {
				const createdAt = new Date(notif.created_at);

				if (createdAt >= startOfToday) {
					groups.today.push(notif);
				} else if (createdAt >= startOfYesterday && createdAt < startOfToday) {
					groups.yesterday.push(notif);
				} else if (createdAt >= startOfWeek && createdAt < startOfYesterday) {
					groups.thisWeek.push(notif);
				} else if (createdAt >= startOfLastWeek && createdAt <= endOfLastWeek) {
					groups.lastWeek.push(notif);
				} else {
					groups.old.push(notif);
				}
			});

			return groups;
		},
	},

	/* =========================
   * ACTIONS
   ========================= */
	actions: {
		formatDate(date: string) {
			return new Intl.DateTimeFormat("fr-FR", {
				dateStyle: "short",
				timeStyle: "short",
			}).format(new Date(date));
		},

		/** ======================
     * FETCH NOTIFICATIONS
     ======================= */
		async fetchNotifications() {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res = await $api("/notifications");

				this.notifications = res.data ?? res;
				this.unreadCount = res.unread_count ?? 0;
			} catch (error) {
				console.error("Erreur fetchNotifications", error);
			} finally {
				this.loading = false;
			}
		},

		/** ======================
     * MARQUER COMME LUE
     ======================= */
		async markAsRead(notificationId: string) {
			const { $api } = useNuxtApp();

			try {
				await $api(`/notifications/${notificationId}/read`, {
					method: "POST",
				});

				const notif = this.notifications.find((n) => n.id === notificationId);

				if (notif && !notif.read_at) {
					notif.read_at = new Date().toISOString();
					this.unreadCount = Math.max(this.unreadCount - 1, 0);
				}
			} catch (error) {
				console.error("Erreur markAsRead", error);
			}
		},

		/** ======================
     * TOUT MARQUER COMME LU
     ======================= */
		async markAllAsRead() {
			const { $api } = useNuxtApp();

			try {
				await $api("/notifications/read-all", {
					method: "POST",
				});

				this.notifications.forEach((n) => {
					n.read_at = n.read_at ?? new Date().toISOString();
				});

				this.unreadCount = 0;
			} catch (error) {
				console.error("Erreur markAllAsRead", error);
			}
		},

		/** ======================
     * SUPPRIMER NOTIFICATION
     ======================= */
		async deleteNotification(id: string) {
			const { $api } = useNuxtApp();
			const toast = useToast();

			try {
				await $api(`/notifications/${id}`, { method: "DELETE" });

				const notif = this.notifications.find((n) => n.id === id);
				if (notif && !notif.read_at) {
					this.unreadCount = Math.max(this.unreadCount - 1, 0);
				}

				this.notifications = this.notifications.filter((n) => n.id !== id);
				toast.success({ message: "Notification supprimée" });
			} catch (error) {
				console.error("Erreur deleteNotification", error);
				toast.error({ message: "Impossible de supprimer la notification" });
			}
		},
	},
});
