import { config } from './config.js';

class ChatBot {
  constructor() {
    this.container = document.getElementById('chat-bot-container');
    this.toggleButton = document.getElementById('chat-bot-toggle');
    this.closeButton = document.getElementById('close-chat');
    this.messagesContainer = document.getElementById('chat-messages');
    this.userInput = document.getElementById('user-message');
    this.sendButton = document.getElementById('send-message');
    this.conversationHistory = [];
    
    this.initialize();
  }

  initialize() {
    // Setup event listeners
    this.toggleButton.addEventListener('click', () => this.toggleChat());
    this.closeButton.addEventListener('click', () => this.toggleChat(false));
    this.sendButton.addEventListener('click', () => this.handleUserMessage());
    this.userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleUserMessage();
      }
    });

    // Initial system message for the AI
    this.conversationHistory.push({
      role: "system",
      content: `You are a helpful assistant for BookingJini, an AI-powered platform for hotel owners 
      to generate social media content. Provide concise, friendly responses about our 
      features like AI caption generation, image creation, and social media design. 
      Suggest post ideas for hotels when asked and recommend best practices for hotel marketing.`
    });
  }

  toggleChat(show = undefined) {
    if (show === undefined) {
      this.container.classList.toggle('active');
    } else {
      if (show) {
        this.container.classList.add('active');
      } else {
        this.container.classList.remove('active');
      }
    }

    // If opening chat, focus on input
    if (this.container.classList.contains('active')) {
      setTimeout(() => this.userInput.focus(), 300);
    }
  }

  async handleUserMessage() {
    const userMessage = this.userInput.value.trim();
    if (!userMessage) return;

    // Clear input
    this.userInput.value = '';
    
    // Add user message to UI
    this.addMessageToUI('user', userMessage);
    
    // Add typing indicator
    const typingIndicator = this.addTypingIndicator();
    
    // Add to conversation history
    this.conversationHistory.push({
      role: "user",
      content: userMessage
    });

    try {
      // Get AI response using websim.chat
      const completion = await websim.chat.completions.create({
        messages: this.conversationHistory,
      });

      // Remove typing indicator
      this.messagesContainer.removeChild(typingIndicator);
      
      // Add AI response to conversation history
      this.conversationHistory.push(completion);
      
      // Add AI response to UI
      this.addMessageToUI('bot', completion.content);
      
      // Scroll to bottom
      this.scrollToBottom();
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Remove typing indicator
      this.messagesContainer.removeChild(typingIndicator);
      
      // Add error message
      this.addMessageToUI('bot', "I'm sorry, I encountered an error. Please try again later.");
    }
  }

  addMessageToUI(type, message) {
    const messageEl = document.createElement('div');
    messageEl.className = type === 'user' ? 'user-message' : 'bot-message';
    
    const avatarEl = document.createElement('div');
    avatarEl.className = 'message-avatar';
    
    const icon = document.createElement('i');
    icon.className = type === 'user' ? 'fas fa-user' : 'fas fa-robot';
    avatarEl.appendChild(icon);
    
    const contentEl = document.createElement('div');
    contentEl.className = 'message-content';
    contentEl.textContent = message;
    
    messageEl.appendChild(avatarEl);
    messageEl.appendChild(contentEl);
    
    this.messagesContainer.appendChild(messageEl);
    this.scrollToBottom();
  }

  addTypingIndicator() {
    const typingEl = document.createElement('div');
    typingEl.className = 'bot-message typing';
    
    const avatarEl = document.createElement('div');
    avatarEl.className = 'message-avatar';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-robot';
    avatarEl.appendChild(icon);
    
    const contentEl = document.createElement('div');
    contentEl.className = 'message-content';
    
    const dotContainer = document.createElement('div');
    dotContainer.className = 'typing-indicator';
    
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('span');
      dot.className = 'typing-dot';
      dotContainer.appendChild(dot);
    }
    
    contentEl.appendChild(dotContainer);
    typingEl.appendChild(avatarEl);
    typingEl.appendChild(contentEl);
    
    this.messagesContainer.appendChild(typingEl);
    this.scrollToBottom();
    
    return typingEl;
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.chatBot = new ChatBot();
});

export default ChatBot;