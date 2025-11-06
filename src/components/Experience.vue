<template>
  <Transition name="fade-up" appear>
    <div class="retro-experience">
      <div class="folder-header">
        <div class="folder-icon"></div>
        <h1>Experience</h1>
      </div>
      <div class="folder-content">
        <ol>
          <li class="tile">
            <a target="_blank" rel="noopener noreferrer" href="https://www.fnsb.gov">
              <header>2025 - Present</header>
              <div>
                <h3>
                  <div class="title">
                    Software Engineering Intern
                    <span><font-awesome-icon icon="fa-solid fa-link" size="sm" /></span>
                  </div>
                  <div class="company">Talendary</div>
                </h3>
                <p>
                  Creating an AI driven recruitment platform at a startup.  
                </p>
                <ul class="pill-list">
                  <li><div class="pill">Remix</div></li>
                  <li><div class="pill">TypeScript</div></li>
                  <li><div class="pill">Python</div></li>
                  <li><div class="pill">FastAPI</div></li>
                  <li><div class="pill">HTML/CSS</div></li>
                </ul>
              </div>
            </a>
          </li>
          <li class="tile">
            <a target="_blank" rel="noopener noreferrer" href="https://www.fnsb.gov">
              <header>2023 - 2024</header>
              <div>
                <h3>
                  <div class="title">
                    Software Developer
                    <span><font-awesome-icon icon="fa-solid fa-link" size="sm" /></span>
                  </div>
                  <div class="company">Fairbanks North Star Borough</div>
                </h3>
                <p>
                  Deliver high-quality reliable software solutions to the borough goverment with diverse projects such as Python automation scripts, full stack web development, and API integrations. 
                  Provide leadership and self-starter contributions within Information Integration department.
                </p>
                <ul class="pill-list">
                  <li><div class="pill">Azure</div></li>
                  <li><div class="pill">Vue</div></li>
                  <li><div class="pill">JavaScript</div></li>
                  <li><div class="pill">TypeScript</div></li>
                  <li><div class="pill">Python</div></li>
                  <li><div class="pill">C#</div></li>
                  <li><div class="pill">GO</div></li>
                  <li><div class="pill">HTML/CSS</div></li>
                </ul>
              </div>
            </a>
          </li>
          <li class="tile">
            <a target="_blank" rel="noopener noreferrer" href="https://www.alaska.edu">
              <header>2021 - 2023</header>
              <div>
                <h3>
                  <div class="title">
                    Student Systems Engineer
                    <span><font-awesome-icon icon="fa-solid fa-link" size="sm" /></span>
                  </div>
                  <div class="company">University of Alaska</div>
                </h3>
                <p>
                  Collaborated with students and staff to create full-stack web applications, resolve tickets, mentor users, improve accessibility, and maintain CI/CD pipelines.
                </p>
                <ul class="pill-list">
                  <li><div class="pill">React</div></li>
                  <li><div class="pill">Vue</div></li>
                  <li><div class="pill">JavaScript</div></li>
                  <li><div class="pill">TypeScript</div></li>
                  <li><div class="pill">Python</div></li>
                  <li><div class="pill">Ruby</div></li>
                  <li><div class="pill">HTML/CSS</div></li>
                  <li><div class="pill">PHP</div></li>
                </ul>
              </div>
            </a>
          </li>
        </ol>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Retro 90s folder style for experience timeline */
.retro-experience {
  background: #c0c0c0;
  border: 2px solid #fff;
  border-top-color: #fff;
  border-left-color: #fff;
  border-bottom-color: #808080;
  border-right-color: #808080;
  max-width: 900px;
  box-shadow: 4px 4px #808080;
  font-family: 'Courier New', Courier, monospace;
}

.folder-header {
  display: flex;
  align-items: center;
  background: linear-gradient(to bottom, #0000ff, #000099);
  color: white;
  padding: 10px;
  border: 2px inset #fff;
  margin-bottom: 10px;
}

.folder-icon {
  width: 40px;
  height: 30px;
  background: #ffff00;
  border: 2px solid #808080;
  margin-right: 10px;
}

.folder-header h1 {
  font-size: 1.5rem;
  margin: 0;
  font-weight: bold;
}

.folder-content {
  background: #e0e0e0;
  padding: 15px;
  border: 2px inset #fff;

  max-height: 500px;
  overflow-y: auto;
}

.experience ol {
  list-style: none;
  padding: 0;
}

.tile {
  padding: 15px;
  margin-bottom: 10px;
  border: 2px solid #fff;
  border-top-color: #fff;
  border-left-color: #fff;
  border-bottom-color: #808080;
  border-right-color: #808080;
  background: #d0d0d0;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

ol{
  list-style: none; 
  padding: 0;
}

.tile:hover {
  background: #a0a0ff;
  transform: translateY(-2px);
}

.tile a {
  text-decoration: none;
  color: black;
}

header {
  font-weight: bold;
  margin-bottom: 5px;
}

.title {
  font-weight: bold;
}

.company {
  font-size: 0.9rem;
  margin-top: 2px;
}

p {
  margin: 10px 0;
  font-size: 0.85rem;
}

.pill-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
}

.pill-list li {
  margin: 4px 6px 4px 0;
}

.pill {
  background-color: #c0c0c0;
  border: 1px solid #808080;
  border-top-color: #fff;
  border-left-color: #fff;
  border-bottom-color: #808080;
  border-right-color: #808080;
  padding: 3px 6px;
  font-size: 0.75rem;
  border-radius: 3px;
}

@media (max-width: 600px) {
  .retro-experience {
    max-width: 100%;
  }
  .folder-header h1 {
    font-size: 1.2rem;
  }
  .tile {
    padding: 10px;
  }
  p {
    font-size: 0.75rem;
  }
  .pill {
    font-size: 0.7rem;
  }
}
</style>
