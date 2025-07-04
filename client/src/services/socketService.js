import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(SOCKET_URL);
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  joinAdminRoom() {
    if (this.socket) {
      this.socket.emit('joinAdminRoom');
    }
  }

  onNewCheckIn(callback) {
    if (this.socket) {
      this.socket.on('newCheckIn', callback);
    }
  }

  onCheckOut(callback) {
    if (this.socket) {
      this.socket.on('checkOut', callback);
    }
  }

  removeListeners() {
    if (this.socket) {
      this.socket.off('newCheckIn');
      this.socket.off('checkOut');
    }
  }
}

const socketService = new SocketService();
export default socketService;