/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.counter');
 * mod.thing == 'a thing'; // true
 */

var dictionary = { 
    Role: "upgrader" 
} //end of variable definition //this is an object literal declaration

//this variable receives the desired number of each creep role from the main function - min_count_roles. property of the role gives # , e.g min_count_roles.upgrader = 1
var creepCounter = {
    run: function(min_count_roles){
        // * Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], 'Test1', {memory:{role: 'maintenance'}});
        // * Game.creeps is a hash containing all your creeps with creep names as hash keys. creep key is one creep key 
        let role_array = [];
        //let possible_roles = ['upgrader', 'builder', 'maintainenance', 'upgrader', 'temporary']; //Can this be an object/key-value pair instead? Further optimization possible here 
        let possible_roles = {
                upgrader: 0, 
                builder: 0,
                maintenance:  0,
                upgrader: 0,
                temporary: 0, 
        };

        // * clear unused memory
        for(var name in Memory.creeps) {
            //console.log(name); //debug statement
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name); //useful game notification on creep spawn
            }
        }

        for(var creep_key  in Game.creeps){
            //console.log('test' + creep_key); // -> Upgrader1, Builder1, etc.
            var creep = Game.creeps[creep_key];
            //console.log('test2' + creep); // -> [creep Upgrader1], [creep Builder2], etc. creep is the value returned when the Game.creeps hash list is provided a singular key.
            role_array.push(creep.memory.role); // -> creates an array of values taken from memory.role such as: 'upgrader', 'builder, 'maintenance'
            possible_roles[creep.memory.role] += 1;
            //console.log(possible_roles[creep.memory.role]); debugging only    
        }
        
        //double for loop to match array against array. definitely room for optimization here. 
        //goal is to say - how many times do I match?
        for(var check_key in possible_roles){
            let check = possible_roles[check_key];
            //console.log(check_key + ' ' + check); // this seems inefficient to display
        }

        //* console.log('hello' + possible_roles['upgrader']); //debugging 
        //*
        //* 
        // *Is there a way to optimize without a bunch of if statements here? Find a way to check f
        /*
        var result = Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], 'Upgrader1', {memory: {role: 'upgrader'}}, {memory:{energy_flag: 0}});
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], 'Upgrader2', {memory: {role: 'upgrader', energy_flag: 0}});
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE,MOVE], 'Upgrader3', {memory: {role: 'upgrader', energy_flag: 0}});
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], 'Builder1', {memory:{role: 'builder'}});
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], 'Builder2', {memory:{role: 'builder'}});
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], 'Builder3', {memory:{role: 'builder'}});
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], 'maintenance1', {memory:{role: 'maintenance'}});

        * Energy costs. Work: 100, Move: 50, Carry: 50  
        //total creeps: 3+2+2+1 , maybe inherit instead. 
        */
        let energy_available = Game.spawns['Spawn1'].room.energyAvailable;
        //console.log(energy_available);
        //console.log(min_count_roles.builder); debug comment 

        if(possible_roles['upgrader'] < min_count_roles.upgrader){
            //console.log('upgrader number is ' + possible_roles['upgrader'] +' Spawning another upgrader. Total available energy is ' + energy_available);// debug 
            if(energy_available > 450){
                Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], 'heavy_Upgrader' + Game.time, {memory: {role: 'upgrader', energy_flag: 0}}); //cost is 450
                Game.notify('heavy creep spawned, energy avialable is '+ energy_available, 1);
            }
            else{
                Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], 'Upgrader' + Game.time, {memory: {role: 'upgrader', energy_flag: 0}}); //cost is 250
                //Game.notify('normal creep spawned, energy avialable is '+ energy_available, 1);
            }
            //Game.notify('New creep has been spawned!', 1);
        }

        if(possible_roles['builder'] < min_count_roles.builder){
            if(energy_available > 450){
                Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], 'heavy_builder' + Game.time, {memory: {role: 'builder', energy_flag: 0}}); //cost is 450
                Game.notify('heavy creep spawned, energy avialable is '+ energy_available, 1);
            }
            else{
                const notify = Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], 'builder' + Game.time, {memory: {role: 'builder', energy_flag: 0}}); //cost is 250
                if(notify == 0){
                    Game.notify('normal creep spawned, energy avialable is '+ energy_available, 1);
                }
            }
        }

        if(possible_roles['maintenance'] < min_count_roles.maintenance){
            //console.log(energy_available + 'maintenance creep counter debug statement'); //debug statement
            if(energy_available > 450){
                Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], 'heavy_maintenance' + Game.time, {memory: {role: 'maintenance', energy_flag: 0}}); //cost is 450
                Game.notify('heavy creep spawned, energy avialable is '+ energy_available, 1);
            }
            else{
                Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], 'maintenance' + Game.time, {memory: {role: 'maintenance', energy_flag: 0}}); //cost is 250
                //Game.notify('normal creep spawned, energy avialable is '+ energy_available, 1);
            }
        }

        if(possible_roles['repair'] < min_count_roles.repair){
            console.log(energy_available); //debug statement
            if(energy_available > 450){
                Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], 'heavy_repair' + Game.time, {memory: {role: 'repair', energy_flag: 0}}); //cost is 450
                Game.notify('heavy creep spawned, energy avialable is '+ energy_available, 1);
            }
            else{
                //Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], 'repair' + Game.time, {memory: {role: 'repair', energy_flag: 0}}); //cost is 250
                //Game.notify('normal creep spawned, energy avialable is '+ energy_available, 1);
            }
        }
        
    }//end function definition
}//end variable definition
module.exports = creepCounter;