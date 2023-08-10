# swym-url-masker-app
Submission for Swym Build Round

I am building a URL Masking App. 

### Tech stack: HTML, CSS, JS, NodeJS and Express JS

### How to start the project? 
1. Clone the project using `git clone`
2. Open it in VS code or any other editor and run `npm install` in the terminal (to install the dependencies).
3. Type `npm start` in the terminal to start the server.
4. This should start the server, then navigate to the browser and type in `http://localhost:5000/`. This should display the index.html file.
5. Before trying to download the CSV, make sure that you click on fetch.

### Data Flow 
1. The user uploads a CSV of the urls. Each url is in the same column but on a new line.
2. In javascript I take the CSV, parse it and then send it to the backend as an array in req.body.
3. The URL's are taken one by one in the server and then a mask is generated and stored in the mongoDB database.
4. When the user clicks on the fetch button the data is fetched from the mongodb data base and displayed in a table.
5. When the user clicks on the download button it downloads as a CSV.
   

### Sample Screenshot

![image](https://github.com/IshaanShettigar/swym-url-masker-app/assets/77607172/5af59521-ac47-43f0-b587-75f83f31e0b6)



