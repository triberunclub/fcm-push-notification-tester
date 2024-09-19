import { setupUI } from './ui.js';
import { setupEventListeners } from './eventListeners.js';
import { NotificationManager } from './notificationManager.js';
import { HistoryManager } from './historyManager.js';
import { FirebaseConfigManager } from './firebaseConfigManager.js';

document.addEventListener('DOMContentLoaded', () => {
    setupUI();
    const historyManager = new HistoryManager();
    const notificationManager = new NotificationManager(historyManager);
    const firebaseConfigManager = new FirebaseConfigManager();
    setupEventListeners(notificationManager, historyManager, firebaseConfigManager);
});