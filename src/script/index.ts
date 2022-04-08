import fs from "fs";
import oicq from "oicq";
import path from "path";


export class TinaSproutRobot {
   private tinaSproutRobot: any = this.createTinaSprout();

   createTinaSprout(): any {
       if (this.tinaSproutRobot === null){
          oicq.createClient('',[]);
       }

    }

}