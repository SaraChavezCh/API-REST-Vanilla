const http = require("http");
const path = require("path");
const fs = require("fs/promises");

const PORT = 8002;

const writtingFile = async (jasonPath, arr) => {
  await fs.writeFile(jasonPath, JSON.stringify(arr));
};

const app = http.createServer(async (request, response) => {
  //Leer el metodo de la petición GET POST PUT etc..
  const requestURL = request.url;
  const requestMethod = request.method;
  // imprimir ruta y metodo de la peticion
  // console.log(requestURL, requestMethod);
  //responder el data.json cuando se realice un GET al endpoint /apiv1/tasks
  const jasonPath = path.resolve("./data.json");
  const jsonFile = await fs.readFile(jasonPath, "utf-8"); // ARCHIVO original
  let arr = JSON.parse(jsonFile);
  // console.log("array inicial" , arr)



  if (requestURL === "/apiv1/tasks/" && requestMethod === "GET") {
    // responder con data.jason
    response.setHeader("Content-Type", "application/json");
    response.writeHead(200);
    response.write(jsonFile);
    console.log(arr.length)
  }

  if (requestURL === "/apiv1/tasks/" && requestMethod === "POST") {
    response.writeHead(201, {"Content-Type": "application/json"});
    if (arr.length != 0){ 
    request.on("data", async (data) => {
        arr = arr.sort((a, b) => a.id - b.id);
        console.log(arr);
        const id = arr[arr.length - 1].id;
        const newTask = JSON.parse(data); // obtener info
        newTask.id = id + 1;
        arr.push(newTask);
        console.log(arr);
        await writtingFile(jasonPath, arr);
        });
   }
   else{ 
    console.log("esta vacio")
    request.on("data", async (data) => {
    arr = arr.sort((a, b) => a.id - b.id);
    const newTask = JSON.parse(data); // obtener info
    newTask.id = 1;
    arr.push(newTask);
    await writtingFile(jasonPath, arr);
  });
}
  }

  http://localhost:8002/apiv1/tasks/id.includes("/id/")
  if (requestURL.includes("/apiv1/task/") && requestMethod === "PUT") {
    const splitUrl = requestURL.split("/");
    const id = Number(splitUrl[splitUrl.length-1]);
    response.setHeader("Content-Type", "application/json");
    response.writeHead(201);
    request.on("data", async(data)=>{
      data = JSON.parse(data);  // objeto que voy a modificar
     const newArr = arr.map((task)=>{
       if (task.id === id){
        task.status = data.status
       }
       return task
      });
      await writtingFile(jasonPath, newArr);
      console.log(newArr)
    });
    // console.log(splitUrl);
    // console.log(id);
    console.log(requestURL.includes("/apiv1/task/"));
  }
  if (requestURL.includes("/apiv1/task/") && requestMethod === "DELETE") {
    const splitUrl = requestURL.split("/");
    const id = Number(splitUrl[splitUrl.length-1]);
    
    response.writeHead(200, {"Content-Type": "application/json"});
  
      const arrFiltered = arr.filter(task => task.id !== id );
      await writtingFile(jasonPath, arrFiltered)
      console.log(arrFiltered);
  }

  if (requestURL !== "/apiv1/tasks/" && !requestURL.includes("/apiv1/task/")){ 
    response.writeHead(503);
  }
  response.end();
});



app.listen(PORT);
console.log(`server runnig in PORT ${PORT}`);
