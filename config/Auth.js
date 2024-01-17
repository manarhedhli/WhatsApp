
import firebase from ".";

const updateOnlineStatus = async (uid, isOnline) => {
    console.log("here from update status ")
    try {
      const database = firebase.database();
      const refProfils = database.ref("Profils");      
      await refProfils.child(uid).update({
        isOnLine: isOnline,
      });  
      console.log(`User ${uid} is ${isOnline ? 'online' : 'offline'}`);
    } catch (error) {
      console.error('Error updating online status:', error);
    }
};


export {
    updateOnlineStatus,
};
  