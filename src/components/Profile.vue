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
/* Retro 90s Windows Explorer style */
.retro-profile {
  background: #c0c0c0; /* classic gray window background */
  border: 2px solid #fff; /* beveled border effect */
  border-top-color: #fff;
  border-left-color: #fff;
  border-bottom-color: #808080;
  border-right-color: #808080;
  padding: 25px;
  font-family: 'Courier New', Courier, monospace; /* pixel-style font */
  max-width: 800px;

  box-shadow: 4px 4px #808080; /* classic 90s drop shadow */
}

.folder-header {
  display: flex;
  align-items: center;
  background: linear-gradient(to bottom, #0000ff, #000099);
  color: white;
  padding: 10px;
  border: 2px inset #fff;
  margin-bottom: 15px;
}

.folder-icon {
  width: 40px;
  height: 30px;
  background: #ffff00; /* yellow folder icon */
  border: 2px solid #808080;
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
  background: #e0e0e0;
  padding: 15px;
  border: 2px inset #fff;
}

.folder-content p {
  margin: 15px 0;
  line-height: 1.4;
  color: #000;
}

.folder-content a {
  color: #0000ff;
  text-decoration: underline;
}

.folder-content a:hover {
  color: #ff0000;
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
