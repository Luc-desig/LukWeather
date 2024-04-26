import express from "express"
import axios from "axios"
import bodyParser from "body-parser"

const app = express();
const port = 3000;

const config ={ 
  params: { appid: "7f1889e6d3ce42c919f4c6e0c4c43432"}
};

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/help", (req, res) => {
res.render("help.ejs");
});

app.post("/get-forecast", async (req, res) => {
  // RECEVING LATITUDE AND LONGITUDE FROM THE USER
      const searchLatitude = req.body.latitude;
      const searchLongitude = req.body.longitude;
      const location = searchLatitude + ", " + searchLongitude
  
      try {
        const currentHourJSON = await axios.get(`https://timeapi.io/api/Time/current/coordinate?latitude=${searchLatitude}&longitude=${searchLongitude}`)
        const currentForecastJSON = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${searchLatitude}&lon=${searchLongitude}&units=metric`, config);
        const threeHourForecastJSON = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${searchLatitude}&lon=${searchLongitude}&units=metric`, config);
        res.render("index.ejs", { 
          currentContent: currentForecastJSON.data,
          threeHourContent: threeHourForecastJSON.data, 
          currentHour: currentHourJSON.data,
          map: location,
  
        });
      } catch (error) {
        res.render("index.ejs", { currentContent: error,threeHourContent: error   });
      }
    });
    

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });