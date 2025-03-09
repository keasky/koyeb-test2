
    document.addEventListener('DOMContentLoaded', function() {
      const messagesContainer = document.getElementById('chat-messages');
      const messageInput = document.getElementById('message-input');
      const sendButton = document.getElementById('send-button');
      
      // メッセージ送信関数
      async function sendMessage() {
        const messageText = messageInput.value.trim();
        
        if (messageText !== '') {
          // 現在時刻を取得
          const now = new Date();
          const hours = now.getHours().toString().padStart(2, '0');
          const minutes = now.getMinutes().toString().padStart(2, '0');
          const timeString = `${hours}:${minutes}`;
          
          // ユーザーのメッセージを追加
          appendMessage('sent', '', messageText, timeString);
          
          // 入力欄をクリア
          messageInput.value = '';
          const response = await gemini(messageText);
          console.log(response);
          // 少し遅延してボットからの返信を表示
          setTimeout(() => {
            
            appendMessage('received', 'Bot', response, timeString);
          }, 500);
        }
      }
      async function gemini(message) {
        return await fetch('http://127.0.0.1:8000/gemini/'+message, {
          method: 'GET',
        }).then(response => response.json()).then(data => {
        console.log(data);
          return data;
        }).catch(error => {
          console.error('Error:', error);
          return 'Error: ' + error.message;
        })
      }
      // メッセージ追加関数
      function appendMessage(type, avatar, text, time) {
        console.log(type, avatar, text, time);
        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'message-wrapper';
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        if (type === 'received') {
          const avatarDiv = document.createElement('div');
          avatarDiv.className = 'avatar';
          avatarDiv.textContent = avatar;
          messageDiv.appendChild(avatarDiv);
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;
        messageDiv.appendChild(contentDiv);
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = time;
        
        messageWrapper.appendChild(messageDiv);
        messageWrapper.appendChild(timeDiv);
        
        messagesContainer.appendChild(messageWrapper);
        
        // 最新のメッセージが見えるようにスクロール
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
      
      // 送信ボタンのクリックイベント
      sendButton.addEventListener('click', sendMessage);
      
      // Enterキーでも送信できるようにする
      messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          sendMessage();
        }
      });
    });