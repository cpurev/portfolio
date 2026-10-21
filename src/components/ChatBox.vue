<script setup>
import { computed, nextTick, ref } from "vue";

/* Centred "Ask about me" chat. Replies come from /api/chat, which has
   Gemini pick prewritten answers (api/_responses.js); the key never
   reaches the browser. */

const suggestions = [
  "What do you work on?",
  "What's your stack?",
  "Show me your projects",
];

const draft = ref("");
const messages = ref([]);
const busy = ref(false);
const input = ref(null);
const log = ref(null);

const canSend = computed(() => draft.value.trim().length > 0 && !busy.value);

/* Split plain text into text and URL pieces, so links are clickable
   without ever rendering the model's output as HTML. */
const URL_RE = /(https?:\/\/[^\s)]+[^\s).,!?;:'"])/g;
const pieces = (text) =>
  text.split(URL_RE).map((part, i) => ({ link: i % 2 === 1, text: part }));

const grow = () => {
  const el = input.value;
  el.style.height = "auto";
  el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
};

const scrollDown = async () => {
  await nextTick();
  log.value?.scrollTo({ top: log.value.scrollHeight, behavior: "smooth" });
};

const send = async (text = draft.value) => {
  const content = text.trim();
  if (!content || busy.value) return;
  const history = [...messages.value, { role: "user", content }];
  messages.value.push({ role: "user", content });
  messages.value.push({ role: "assistant", content: "", pending: true });
  const reply = messages.value[messages.value.length - 1];
  draft.value = "";
  busy.value = true;
  await nextTick();
  grow();
  input.value.focus();
  scrollDown();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        messages: history.filter((m) => !m.failed),
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { reply: text } = await res.json();
    if (!text) throw new Error("Empty reply");
    reply.content = text;
  } catch {
    reply.content =
      "Sorry, I couldn't answer just now. Try again in a moment, or email puluunbat@gmail.com.";
    reply.failed = true;
  } finally {
    reply.pending = false;
    busy.value = false;
    scrollDown();
  }
};

const onKeydown = (event) => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    send();
  }
};
</script>

<template>
  <main class="chat">
    <Transition name="fade">
      <h1 v-if="!messages.length" class="title">Ask about me</h1>
    </Transition>

    <div
      v-if="messages.length"
      ref="log"
      class="log"
      role="log"
      aria-live="polite"
    >
      <p
        v-for="(m, i) in messages"
        :key="i"
        class="bubble"
        :class="[m.role, { failed: m.failed }]"
      >
        <span v-if="m.pending" class="typing" aria-label="Thinking">
          <i></i><i></i><i></i>
        </span>
        <template v-for="(piece, j) in pieces(m.content)" :key="j">
          <a
            v-if="piece.link"
            :href="piece.text"
            target="_blank"
            rel="noreferrer"
            >{{ piece.text }}</a
          >
          <template v-else>{{ piece.text }}</template>
        </template>
      </p>
    </div>

    <form class="card" @submit.prevent="send()">
      <textarea
        ref="input"
        v-model="draft"
        class="input"
        rows="2"
        placeholder="Ask me anything…"
        aria-label="Ask about me"
        @input="grow"
        @keydown="onKeydown"
      ></textarea>
      <div class="bar">
        <span class="hint">Enter to send · Shift+Enter for a new line</span>
        <button
          class="send"
          type="submit"
          :disabled="!canSend"
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M12 19V5M5 12l7-7 7 7"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </form>

    <ul v-if="!messages.length" class="chips">
      <li v-for="s in suggestions" :key="s">
        <button type="button" class="chip" @click="send(s)">{{ s }}</button>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.chat {
  --c-ink: #121212;
  --c-dim: #6b6b6b;
  --c-line: rgba(18, 18, 18, 0.1);
  --c-card: rgba(255, 255, 255, 0.78);

  color-scheme: light;
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  padding: 1.5rem 1rem;
  pointer-events: none; /* let the sea behind react to the cursor */
}

.chat > * {
  pointer-events: auto;
}

.title {
  font-size: clamp(1.75rem, 5vw, 2.75rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  color: var(--c-ink);
  width: min(680px, 100%); /* aligns with the card's left edge */
  padding-left: 0.25rem;
  pointer-events: none;
}

.log {
  width: min(680px, 100%);
  max-height: 40vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.25rem 0.25rem 0.25rem;
  /* Scrolls, but without a visible scrollbar; older messages fade out at the top. */
  scrollbar-width: none;
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 1.5rem);
  mask-image: linear-gradient(to bottom, transparent, #000 1.5rem);
}

.log::-webkit-scrollbar {
  display: none;
}

.fade-leave-active {
  transition: opacity var(--dur-slow) var(--ease),
    transform var(--dur-slow) var(--ease);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.bubble {
  max-width: 85%;
  padding: 0.65rem 0.95rem;
  border-radius: 18px;
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.bubble.user {
  align-self: flex-end;
  background: var(--c-ink);
  color: #fff;
  border-bottom-right-radius: 6px;
}

.bubble.assistant {
  align-self: flex-start;
  background: var(--c-card);
  color: var(--c-ink);
  border: 1px solid var(--c-line);
  border-bottom-left-radius: 6px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.bubble a {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.bubble.failed {
  color: var(--c-dim);
}

.typing {
  display: inline-flex;
  gap: 4px;
  padding: 0.35rem 0;
}

.typing i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c-dim);
  animation: blink 1.2s infinite ease-in-out;
}

.typing i:nth-child(2) {
  animation-delay: 0.15s;
}

.typing i:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0.25;
  }
  40% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .typing i {
    animation: none;
    opacity: 0.6;
  }
}

.card {
  width: min(680px, 100%);
  background: var(--c-card);
  border: 1px solid var(--c-line);
  border-radius: 24px;
  padding: 0.9rem 0.9rem 0.7rem 1.1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 12px 40px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(14px) saturate(1.2);
  -webkit-backdrop-filter: blur(14px) saturate(1.2);
  transition: border-color var(--dur) var(--ease),
    box-shadow var(--dur) var(--ease);
}

.card:focus-within {
  border-color: rgba(18, 18, 18, 0.22);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 16px 48px rgba(0, 0, 0, 0.12);
}

.input {
  display: block;
  width: 100%;
  resize: none;
  border: 0;
  outline: none;
  background: transparent;
  font: inherit;
  font-size: 1rem; /* ≥16px so iOS doesn't zoom on focus */
  line-height: 1.5;
  color: var(--c-ink);
}

.input::placeholder {
  color: var(--c-dim);
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.4rem;
}

.hint {
  font-size: var(--fs-xs);
  color: var(--c-dim);
}

.send {
  flex: none;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: var(--c-ink);
  color: #fff;
  cursor: pointer;
  transition: transform var(--dur-fast) var(--ease),
    opacity var(--dur-fast) var(--ease);
}

.send:hover:not(:disabled) {
  transform: translateY(-1px);
}

.send:disabled {
  opacity: 0.25;
  cursor: default;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  width: min(680px, 100%);
}

.chip {
  font: inherit;
  font-size: var(--fs-xs);
  color: var(--c-ink);
  background: var(--c-card);
  border: 1px solid var(--c-line);
  border-radius: 999px;
  padding: 0.45rem 0.85rem;
  cursor: pointer;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: background var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease);
}

.chip:hover {
  background: #fff;
  border-color: rgba(18, 18, 18, 0.22);
}

@media (max-width: 520px) {
  .hint {
    display: none;
  }
}
</style>
