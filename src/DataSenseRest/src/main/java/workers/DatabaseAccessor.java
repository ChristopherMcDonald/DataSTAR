package workers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;

public class DatabaseAccessor{
	private static DB database;
	
	static{
		try{
			database = (new MongoClient(new MongoClientURI("mongodb://localhost:27017"))).getDB("datasense");
		}catch(Exception e){
			System.out.println("ERROR IN STATIC INITIALIZER.");
		}
	}
	
	/**
	 * Gets a list of all the dataset ids.
	 * @return All the dataset ids
	 */
	public static String[] queryDatasetIDs(){
		@SuppressWarnings("unchecked")
		List<String> results = database.getCollection("clients").distinct("id");
		return results.toArray(new String[0]);
	}

	/**
	 * Updates ticket counts in the database to account for lost tickets.
	 */
	public static void refreshTicketCounts(){
		DBCollection collection = database.getCollection("clients");
		int numComplete, tier;
		
		for(DBObject client : collection.find()){
			for(DBObject dataset : (DBObject[])client.get("datasets")){
				tier = (int)dataset.get("tier");
				if(tier == 1){					//Converting the tiers
					tier = 5;
				}else if(tier == 2){
					tier = 10;
				}else{
					tier = 25;
				}
				for(DBObject resource : (DBObject[])dataset.get("resources")){
					numComplete = ((DBObject[])resource.get("annotations")).length;
					if(tier != numComplete + (int)resource.get("pending")){
						resource.put("pending", numComplete + (int)resource.get("pending"));
						collection.update(resource, resource);
					}
				}
			}
		}
	}

	/**
	 * Queries all tickets from a particular dataset, sets the pending tickets in that dataset to 0.
	 * @param datasetID - The id of the dataset to query.
	 * @return The tickets for that dataset.
	 */
	public static ArrayList<Ticket> queryDataset(String datasetID){
		DBCollection collection = database.getCollection("clients");
		BasicDBObject query = new BasicDBObject(), update = new BasicDBObject();
		ArrayList<Ticket> tickets = new ArrayList<Ticket>();
		
		query.put("datasets.id", datasetID);
		update.put("datasets.resources.pending", 0);
		for(DBObject resource : (DBObject[])collection.find(query).one().get("resources")){
			for(int i = 0; i < (int)resource.get("pending"); i++){
				tickets.add(new Ticket((String)resource.get("link"), datasetID));
			}
		}
		collection.findAndModify(query, update);
		return tickets;
	}
	
	/**
	 * Goes through each of the datasets and creates a pool to hold them all.
	 * @return
	 */
	public static HashMap<String, ArrayList<Ticket>> initPool(){
		HashMap<String, ArrayList<Ticket>> pool = new HashMap<String, ArrayList<Ticket>>();
		
		for(String id : queryDatasetIDs()){
			pool.put(id, queryDataset(id));
		}
		return pool;
	}
}