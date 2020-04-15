/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.temporary');
 * mod.thing == 'a thing'; // true
 */

var roleTemporary = {
    run: function(creep,resource_flag){
        
        
    
        creep.say('T' + resource_flag); //debugging step. Success 
        
        if(creep.store[RESOURCE_ENERGY] == 0){
            resource_flag = 0;
            creep.memory.energy_flag = 0;
        }
    
        if(resource_flag == 0){
            let sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE){
                creep.moveTo(sources[0]);
                creep.say('❤️');
                
            }
            if(creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()){
                creep.say('Full-M');
                creep.memory.energy_flag = 1;
                resource_flag = 1;
            }
            
        }
        else if(resource_flag == 1){
            //creep.say('temp');//debugging step. success
            //var extensions = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {filter: (structure) =>  return(structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity)}} );
            //var extensions = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) =>  return(structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity)}} );

            /* what the hell is happening here
                Find out why this works. 
            */
            var extensions = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity) }});
            
            if(creep.transfer(extensions, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(extensions, {visualizePathStyle: {stroke: '#ffffff'}});
                creep.say('moving');
            }
            else{  
                creep.say('transfering');
                creep.say(creep.store[RESOURCE_ENERGY]);
                if(creep.store[RESOURCE_ENERGY] == 0){
                    //creep.say('empty');
                    creep.say(resource_flag);
                    creep.memory.energy_flag = 0;
                }
            }
            
        }
    
    }//end function definition
    
}//end variable definition

module.exports = roleTemporary