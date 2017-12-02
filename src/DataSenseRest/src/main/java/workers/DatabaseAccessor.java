import java.util.ArrayList;
import java.util.HashMap;

public class DatabaseAccessor{
	public static int[] queryDatasetIDs(){
		//TODO query all datasetIDs
		return null;
	}

	public static Ticket[] queryTickets(int datasetID, int num){
		//TODO grab n tickets from datasetID
		return null;
	}

	public static void refreshTicketCounts(){
		//TODO initializing system, might be some lost tickets. Set amount left for all to total minus confirmed
	}

	public static HashMap<Integer, ArrayList<String>> queryNewTickets(){
		//TODO grab all tickets where there are some copies left to be grabbed
		return null;
	}
}