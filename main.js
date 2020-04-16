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
            builder: 1,
            maintenance: 2,
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
        towerRepair(tower);
    } // end for loop iterating across towers 
    
    //this for loop grabs the creep hash within the global Game object and feeds it to the modules based on each creep memory role  
    for(let name in Game.creeps){ // for-in loop, loops over all the properties of the object. 
        let creep = Game.creeps[name];
        if(creep.ticksToLive <= 100){

            creep.say("☠️");
            if(creep.store.getFreeCapacity() < creep.store.getCapacity()){
                creep.say("☠️1");
                console.log(creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY));
                console.log(Game.spawns.Spawn1.store.getFreeCapacity(RESOURCE_ENERGY) +' spawn freecapacity - main');
                //Game.spawns.Spawn1.renewCreep(creep);
                if(creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(Game.spawns.Spawn1,{visualizePathStyle: {stroke: '#ffffff'}});
                    console.log('energy transfer');
                    console.log(Game.spawns.Spawn1.store.getFreeCapacity(RESOURCE_ENERGY) +' spawn free capacity after transfer - main');
                }
            }
            else{
                creep.moveTo(Game.flags.Flag1);
                creep.say("☠️2");
            }
            /*
            if(transfer_targets.length > 0) {//maintain extensions   
                if(creep.transfer(transfer_targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(transfer_targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    //console.log(transfer_targets[0] + ' maintenance debug'); //debug statement
                }
            }

            var transfer_targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) ||  
                        (structure.structureType == STRUCTURE_SPAWN && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) ||
                        (structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0));
                    }
        });
            */
            continue;
        }
        else{
            switch(creep.memory.role){
                case 'upgrader':
                    roleUpgrader.run(creep);
                    break;
                case 'builder':
                    roleBuilder.run(creep);
                    break;
                case 'maintenance':
                    roleMaintenance.run(creep);
                    break;
                default:
                    creep.say('UndefRole');
                    break;
            }//end switch statement
        }//end else statement

    } // end for loop role definition for loop that calls on modules for each memory role. 
    
}; //end main function


//* secondary functions 

function towerRepair(tower){
    let towerArray = Game.rooms.E1S15.find(FIND_STRUCTURES, {filter: (r) => r.structureType == STRUCTURE_ROAD}); //this is ugly as hell - optimize and sort. Add
    if(tower.store.getFreeCapacity(RESOURCE_ENERGY) < 1*tower.store.getCapacity(RESOURCE_ENERGY)/3) {
        for(let target in towerArray){
            let road_health = towerArray[target].hits;
            //console.log(road_health); //debug statement
            if(road_health < 25000){
                tower.repair(towerArray[target]);
            }
        }
    }
    else{
        return;
    }    
    //console.log(JSON.stringify(tower_road_target) + 'tower road target'); //debug statement
    //let tower_road_target = tower.pos.find(FIND_STRUCTURES, {filter: (r) => r.structureType == STRUCTURE_ROAD}); //more work needed for road repair   
} //end towerRepair function definition

function towerAttack(tower){
    let towerTarget = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(towerTarget != undefined){
        tower.attack(towerTarget);
    }
     //console.log(tower + 'tower name' + tower.pos); //debug statement    
}//end towerAttack function definition