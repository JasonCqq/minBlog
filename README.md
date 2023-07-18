<a name="readme-top"></a>

[![LinkedIn][linkedin-shield]][linkedin-url]

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/jason-huang-38813324b/

<br />
<div align="center">
<h1 align="center">minBlog</h1>

  <p align="center">
    <b>minBlog is a reading platform, and a blog sharing platform that has short (<1500chars) blogs</b>
    <br/>
    <b>With features like secure authentication encrypted with bcrypt and secured with passport/cookie-session
    <br/>
    <b>along with mobile responsiveness, and a quick read bionic reading experience</b>
    <br/>
    <b>minBlog takes your blog consumption to new heights</b>
    <br />
    <br />
  </p>
</div>

<h2 align="center">[View Demo](https://minblog21715.netlify.app/)</h2>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## Project Showcase
https://github.com/jason21715/minBlog/assets/121495300/8f8b365f-1cd6-4098-b3d4-fed3cec3df6e

## Features
- [ ] <b>REST API Access for Developers</b>
- [ ] <b>Enhanced Reading with Bionic Reading</b>
- [ ] <b>Search Filtering and Pagination</b>
- [ ] <b>Secure User Authentication with bcrypt/passport/cookie-session</b>
- [ ] <b>Responsive Design for all screens</b>
- [ ] <b>Smooth Dark Mode</b>
- [ ] <b>Blog Bookmarking</b>
      
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
</br>
![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)
</br>
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
</br>
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
</br>
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
</br>
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
</br>
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Prerequisites

Before getting started, make sure you have the following prerequisites installed on your local machine:

Node.js (including npm) - to run the server and build the frontend.
MongoDB - as the database for the project.

### Installation

1. Clone the repo
   ```sh
   git clone git@github.com:jason21715/minBlog.git
   cd Desktop > cd minBlog
   * When setting URLs in .env, ensure there are not ending slashes.
   ```
2. Setup Backend
   ```sh
   cd Desktop > cd minBlog > cd server
   npm install
   Add .env file: {
    SECRET_KEY: (Key for cookie session)
    DATABASE_KEY: (Database Connection String)
    FRONT_END: (React App Address eg. http://localhost:3006)    
    *Change CORS origin in app.js to Front-End Address.
    }
    npm run devstart
   ```
3. Setup Frontend`app.js`
   ```js
      cd Desktop > cd minBlog > cd client
      npm install
      Add .env file: {
        REACT_APP_FRONT_END: (React App Address eg. http://localhost:3006)    
        REACT_APP_BACK_END: (Server Address, eg. http://localhost:3000)
      }
      npm start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Jason Huang - jason.cq.huang@gmail.com

Project Link: [https://github.com/jason21715/minBlog](https://github.com/jason21715/minBlog)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
