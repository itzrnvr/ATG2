import { LocalServerModule } from '../native'

class Server{
    startServer(){ 
        LocalServerModule.startServer()
        .then(result => {
            console.log(result); // Should log "Result from yourParam"
            console.log("Server running"); // Should log "Result from yourParam"
        }).catch(e => {
            console.log("Something went wrong fr")
        })
    }
    
    stopServer(){
        LocalServerModule.stopServer()
    }
}

export default Server


