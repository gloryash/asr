import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useRealtimeVoiceChat } from './hooks/useRealtimeVoiceChat';
import { DashScopeChatProvider } from './services/chat/DashScopeChatProvider';
import { loadConfig, saveConfig, type AppConfig } from './stores/config';
import { SettingsPanel } from './components/SettingsPanel';
import { ChatHistory, type Message } from './components/ChatHistory';
import { CenterChat } from './components/CenterChat';
import { VoiceState } from './services/voice/VoiceStateMachine';
import './App.css';

function App() {
  const [config, setConfig] = useState<AppConfig>(loadConfig);
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const lastMsgIdRef = useRef<string | null>(null);

  const chatProvider = useMemo(() => {
    if (!config.apiKey) return undefined;
    return new DashScopeChatProvider(config.apiKey, config.llmModel, config.systemPrompt);
  }, [config.apiKey, config.llmModel, config.systemPrompt]);

  const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    const id = Date.now().toString();
    lastMsgIdRef.current = id;
    setMessages((prev) => [...prev, { id, role, content }]);
  }, []);

  const updateLastMessage = useCallback((content: string) => {
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      return [...prev.slice(0, -1), { ...last, content: last.content + content }];
    });
  }, []);

  const chat = useRealtimeVoiceChat({
    apiKey: config.apiKey,
    voiceId: config.voiceId,
    voiceDisturbEnabled: config.voiceDisturbEnabled,
    chatProvider,
    messageCallbacks: {
      onUserMessage: (text) => addMessage('user', text),
      onAssistantMessage: (text, isFirst) => {
        if (isFirst) addMessage('assistant', text);
        else updateLastMessage(text);
      },
      onUpdateUserMessage: (text) => {
        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const last = prev[prev.length - 1];
          if (last.role === 'user') {
            return [...prev.slice(0, -1), { ...last, content: text }];
          }
          return prev;
        });
      },
    },
    uiCallbacks: { onAlert: (msg) => alert(msg) },
  });

  const handleSaveConfig = useCallback((newConfig: AppConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
  }, []);

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;
    chat.sendTextMessage(inputText.trim());
    setInputText('');
  }, [inputText, chat]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const getStateText = () => {
    switch (chat.voiceState) {
      case VoiceState.LISTENING: return '监听中...';
      case VoiceState.RECORDING: return '录音中...';
      case VoiceState.PROCESSING: return '识别中...';
      default: return '空闲';
    }
  };

  useEffect(() => {
    if (!config.apiKey) setShowSettings(true);
  }, [config.apiKey]);

  return (
    <div className="app">
      <div className="main-area">
        <header>
          <h1>语音对话 Demo</h1>
          <button className="settings-btn" onClick={() => setShowSettings(true)}>设置</button>
        </header>
        <div className="spacer" />
        <div className="bottom-section">
          <CenterChat messages={messages} />
          <div className="control-panel">
            <div className="status">状态: {getStateText()}</div>
            <div className="buttons">
              <button onClick={chat.startListening} disabled={chat.voiceState !== VoiceState.IDLE || !config.apiKey}>开始语音</button>
              <button onClick={chat.stopListening}>停止语音</button>
              <button onClick={chat.stopAll}>停止全部</button>
            </div>
          </div>
          <div className="input-area">
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyDown} placeholder="输入文字消息..." disabled={!config.apiKey} />
            <button onClick={handleSend} disabled={!config.apiKey || !inputText.trim()}>发送</button>
          </div>
        </div>
      </div>
      <aside className="sidebar"><ChatHistory messages={messages} /></aside>
      {showSettings && <SettingsPanel config={config} onSave={handleSaveConfig} onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default App;
