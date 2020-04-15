module.exports.loop = function () {
    //temp 
    //npm install @types/screeps
    //npm install @types/lodash
    //spawn a creep (ensures if none exists at least one creep with this name exists)

    /*Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], 'Upgrader1', {memory: {role: 'upgrader'}}, {memory:{energy_flag: 0}});
    Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], 'Upgrader2', {memory: {role: 'upgrader', energy_flag: 0}});
    Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE,MOVE], 'Upgrader3', {memory: {role: 'upgrader', energy_flag: 0}});
    Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], 'Builder1', {memory:{role: 'builder'}});
    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], 'Builder2', {memory:{role: 'builder'}});
    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], 'Builder3', {memory:{role: 'builder'}});
    Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], 'maintenance1', {memory:{role: 'maintenance'}});
    */    

    //Activate our modules
    
    var roleUpgrader = require('role.upgrader');
    var roleBuilder = require('role.builder');
    var roleMaintenance = require('role.maintenance');
    var roleTemporary = require('role.temporary'); //debugging only, delete later. 
    var roleRepair = require('role.repair'); //debbuging 4/08
    var creepCounter = require('creep.counter'); // manage how and when creeps are spawned 
    
    //this defines how many harvesters we want on the map 
    let min_count_roles = { 
            upgrader: 3,
            builder: 2,
            maintenance: 1,
            temporary: 0,
            repair: 0,
    };
    //begin the main function, starting with confirming # of creeps. 

    creepCounter.run(min_count_roles); 

    //check for valid tower targets
    // = Game.rooms.E1S15.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_ROAD}});
    var towers = Game.rooms.E1S15.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER});
    for(let tower of towers){
        towerAttack(tower);

        let tower_road_target = Game.rooms.E1S15.find(FIND_STRUCTURES, {filter: (r) => r.structureType == STRUCTURE_ROAD}); //this is ugly as hell - optimize and sort. Add 
        


    } // end for loop iterating across towers 
    
    //this for loop grabs the creep hash within the global Game object and feeds it to the modules based on each creep memory role  
    for(var name in Game.creeps){ // for-in loop, loops over all the properties of the object. 
        var creep = Game.creeps[name];
        var energy_flag = creep.memory.energy_flag
        
        if(creep.memory.role == 'upgrader'){
            roleUpgrader.run(creep);
            //creep.say('hello'); //trace statement
        }
        if(creep.memory.role == 'builder'){
            roleBuilder.run(creep);
            //creep.say('Builder'); //trace statement
        }
        if(creep.memory.role == 'maintenance'){
            roleMaintenance.run(creep);
            //roleRepair.run(creep, energy_flag);
        }
            
    } // end role definition for loop that calls on modules for each memory role. 
    
}; //end main function


//secondary functions 

function towerRepair(tower){
    let towerArray = Game.rooms.E1S15.find(FIND_STRUCTURES, {filter: (r) => r.structureType == STRUCTURE_ROAD}); //this is ugly as hell - optimize and sort. Add
    if(tower.store.getFreeCapacity() < tower.store.getCapacity()/2) {
        for(let target in towerArray){
            let road_health = towerArray[target].hits;
            //console.log(road_health); //debug statement
            if(road_health < 25000){
                tower.repair(tower_road_target[road_target]);
            }
        }
    }
        
//console.log(JSON.stringify(tower_road_target) + 'tower road target'); //debug statement
//let tower_road_target = tower.pos.find(FIND_STRUCTURES, {filter: (r) => r.structureType == STRUCTURE_ROAD}); //more work needed for road repair 
   
}
function towerAttack(tower){
    let towerTarget = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(towerTarget != undefined){
        tower.attack(towerTarget);
    }
     //console.log(tower + 'tower name' + tower.pos); //debug statement    
}