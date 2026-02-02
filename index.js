const fs = require("fs");
const http = require("http");
const url = require("url");
const data = require("./Data/data");
const PORT = process.env.PORT || 5000;

const header = (name) => {
  return `<header><h1>Welcome to ${name}</h1></header>`;
};

const footer = (footerContent) => {
  return `<footer><h3>${footerContent}</h3></footer>`;
};

const server = http.createServer((req, res) => {
  const path = req.url;
  const fullPath = url.parse(path, true);
  const pathName = fullPath.pathname;
  const query = fullPath.query;


  res.writeHead(200, { "Content-Type": "text/html" });
  if (pathName === "/") {
    res.write(header("Welcome to Your Local Hospital Information Portal"));
    res.write(`
            <p><a href="home">Home</a></p>
            <p><a href="services">Services</a></p>
            <p><a href="about">About us</a></p>
            <p><a href="contact">Contact</a></p>`);
    res.write(`
            <h3>How to use this site:</h3>
            <p>1. Click Home to see hospitals.</p>
            <p>2. Click a hospital name to add ?name= in the URL.</p>
            <p>3. Click services to see our services.</p>
            <p>4. Click about to see our about page.</p>
            <p>5. Try: /about?readmore=true to read more.</p>
            <p>6. Click contact to contact us.</p>
            `);

    fs.readFile("./content/index.html", (err, html) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.write("HTML not found");
        return;
      } else {
   
        res.write(html);
        res.write(footer("&copy; Mousumi Mukherjee 2026, made with love"));  
        res.end();
        
      }
    });

    return;
  } else if (pathName === "/home" && query.name) {
    const selectedHospital = data.find((h) => h.name === query.name);

    if (selectedHospital) {
      res.write(`<h1>Welcome to ${selectedHospital.name}</h1>
                <p>Type: ${selectedHospital.type}</p>
                <p>Phone: ${selectedHospital.phone}</p>`);
      res.end();
    } else {
      res.write("Hospital not found");
      res.end();
    }
  } else if (pathName === "/home") {
    res.write(`<h1>Here is your nearby health care</h1>`);

    data.forEach((hospital) => {
      res.write(`<a href="/home?name=${hospital.name}">${hospital.name}</a>
                <p>Type:${hospital.type}</p>
                <p>Phone:${hospital.phone}</p>`);
    });

    res.write(footer("&copy; Mousumi Mukherjee 2026, made with love"));
    res.end();
  } else if (pathName === "/services") {
    res.write(`<h1>What We Offer</h1>
               <p>Our website is designed to make it easy for patients to find information about nearby hospitals. Users can quickly search for healthcare facilities, view contact details, and learn about the services they offer. By providing accurate and up-to-date information, we aim to help people make informed decisions about their healthcare and find the right facility when they need it.</p>`);
    res.write(footer("&copy;  Mousumi Mukherjee 2026, made with love"));
    res.end();
  } else if (pathName === "/about") {
    res.write(`<h1>Meet Our Team</h1>
      <h3>We are a passionate team of healthcare enthusiasts working to make medical information and hospital services accessible for everyone in Stockholm.</h3>
      <div><h1>Team Lead</h1>
           <p>Anna leads our team with a focus on innovation and quality. With a background in healthcare management, she ensures that every project meets the highest standards.</p></div>
      <div><h1>Backend Developer</h1>
      <p>Erik builds the backbone of our website. He loves creating efficient, dynamic, and user-friendly systems that make hospital information easy to access.</p></div>
      <div><h1>Frontend Developer</h1>
      <p>Mousumi crafts the design and interface of our website. She makes sure the site is beautiful, intuitive, and accessible for all users.</p></div>
      <div><h1>Content & Community</h1>
      <p>Lina manages the content and communications. She ensures that the information we provide is clear, accurate, and helpful for patients and visitors.</p></div>
     `);

    if (query.readmore === "true") {
      res.write(`
      <p>Our organization was founded in 2010 with a simple mission: to make healthcare services more accessible and transparent for everyone in Stockholm. 
      From the very beginning, we focused on building a platform where patients could easily find nearby hospitals, clinics, and specialists without confusion or delay.</p>`);
    } else {
      res.write(`<a href="/about?readmore=true">Read more!</a>`);
    }
    res.write(footer("&copy;  Mousumi Mukherjee 2026, made with love"));
    res.end();
  } else if (pathName === "/contact") {
    res.write(`<header><h1>Contact Us!</h1><header>`);
    fs.readFile("./content/contact.html", (err, data) => {
      if (err) {
        res.end("Something went wrong");
      } else {
        res.write(data);
        res.write(footer("&copy; Mousumi Mukherjee 2026, made with love"));
        res.end();
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
