<template>
  <div class="retro-profile">
    <div class="folder-header">
      <div class="folder-icon"></div>
      <h1>Chuluunbat Purev</h1>
      <h2>Software Developer</h2>
    </div>
    <div class="folder-content">
      <p class="typewriter">
        One of my earliest memories is playing Zuma and COD: World At War in an 
        <a href="https://en.wikipedia.org/wiki/PC_bang" target="_blank" rel="noreferrer">internet cafe</a>
        my dad owned when I was little. Fascinated by the endless possibilities computers offered, I knew I wanted to create software used by many.
      </p>
      <p class="typewriter">
        I'm a software developer specializing in building (and occasionally designing) exceptional websites, applications, and everything in between. Currently learning Azure, Go, and Machine Learning.
      </p>
      <p class="typewriter">
        When I'm not at my desk either working or playing games, I'm rock climbing or out on some adventure.
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Privy theme */
.retro-profile {
  background: var(--privy-bg);
  border: 2px solid var(--privy-border);
  padding: 25px;
  font-family: var(--privy-font-family);
  max-width: 800px;
  border-radius: var(--privy-radius);
}

.folder-header {
  display: flex;
  align-items: center;
  background: var(--privy-accent);
  color: var(--privy-fg);
  padding: 10px;
  border: 2px solid var(--privy-border);
  margin-bottom: 15px;
  border-radius: var(--privy-radius);
}

.folder-icon {
  width: 40px;
  height: 30px;
  background: var(--privy-muted);
  border: 2px solid var(--privy-border);
  margin-right: 10px;
}

.folder-header h1 {
  font-size: 1.5rem;
  margin: 0;
  font-weight: bold;
}

.folder-header h2 {
  font-size: 1rem;
  margin: 0 0 0 10px;
  font-weight: normal;
}

.folder-content {
  background: var(--privy-bg);
  padding: 15px;
  border: 2px solid var(--privy-border);
  border-radius: var(--privy-radius);
}

.folder-content p {
  margin: 15px 0;
  line-height: 1.4;
  color: var(--privy-fg);
}

.folder-content a {
  color: var(--privy-muted);
  text-decoration: underline;
}

.folder-content a:hover {
  color: var(--privy-fg);
}

/* Mobile-friendly adjustments */
@media (max-width: 600px) {
  .retro-profile {
    padding: 10px;
  }
  .folder-header h1 {
    font-size: 1.2rem;
  }
  .folder-header h2 {
    font-size: 0.9rem;
  }
  .folder-icon {
    width: 30px;
    height: 20px;
  }
}
</style>
