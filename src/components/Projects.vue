<script setup>
const items = [
  {img: "golang.png", name:'A GO project', description:'Small GO project for learning', languages:['GO'], link:'@'},
  {img: "scholars_proj.png", name:'UA Scholars', description:'Web service for Alaskan highschool delegators to submit their students for scholarship opportunities in University of Alaska', languages:['TypeScript', 'Vue2', 'Fastify', 'Prisma'], link:'https://www.alaska.edu/scholars/'},
  {img: "spotify_proj.png", name:'Spotify Playlist Creator', description:'A simple tool to create playlist of songs with given text', languages:['TypeScript', 'React', 'NextJS','Tailwind'], link:'@'},
  {img: "prot_proj.png", name:'Portfolio', description:'Portfolio website created from scratch with Vue3 and Greensock javascript animation library', languages:['Vue3', 'Greensock'], link:'/'},
  {img: "fletnix_proj.png", name:'Fletnix', description:'Fully functional mock up streaming site with user authentication and roles', languages:['React', 'NextJS', 'MongoDB', 'Tailwind'], link:'https://fletnix.vercel.app/'},
  {img: "oww_proj.png", name:'Our Winter World', description:'A WordPress plugin for snow educational activities', languages:['React', 'WordPress', 'PHP'], link:'http://ourwinterworld.org/'}
]

const handleClick = (link) => { 
  if(link == "@") return; 
  window.open(link, "_blank"); 
}
</script>

<template>
  <div class="retro-gallery">
    <div class="folder-header">
      <div class="folder-icon"></div>
      <h1>Projects</h1>
    </div>
    <div class="folder-content">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Languages</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in items" :key="item.name" @click="handleClick(item.link)" :class="{active: item.link != '@'}">
            <td>{{ index + 1 }}</td>
            <td class="project-name">
              <h3>{{ item.name }}</h3>
              <div class="project-prog">
                <font-awesome-icon v-if="item.link != '@'" icon="fa-solid fa-arrow-up-right-from-square" size="sm" />
                <span v-else>WIP</span>
              </div>
            </td>
            <td><p>{{ item.description }}</p></td>
            <td>
              <ul class="projects-langs">
                <li v-for="lang in item.languages" :key="lang">{{ lang }}</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* 90s Windows folder style */
.retro-gallery {
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
  overflow-x: auto;

  
  max-height: 500px;
  overflow-y: auto;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #808080;
}

th {
  background: #000080;
  color: white;
  font-weight: bold;
  border: 2px inset #fff;
}

tr:hover {
  background-color: #a0a0ff;
}

.active {
  cursor: pointer;
}

.project-prog {
  float: left;
  margin-top: 5px;
  color: #0000ff;
}

.projects-langs {
  list-style: none;
  padding: 0;
  margin: 0;
}

.projects-langs li {
  display: inline-block;
  background: #c0c0c0;
  border: 1px solid #808080;
  margin: 2px;
  padding: 2px 5px;
  font-size: 0.8rem;
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .retro-gallery {
    max-width: 100%;
  }
  .folder-header h1 {
    font-size: 1.2rem;
  }
  th, td {
    font-size: 0.8rem;
    padding: 5px;
  }
}
</style>
