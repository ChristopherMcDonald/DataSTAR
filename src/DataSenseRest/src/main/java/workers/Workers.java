package workers;

import java.util.ArrayList;
import java.util.HashMap;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

class TicketAllocationWorker implements Runnable{
	@Override
	public void run(){
		System.out.println("C-OK");
		//TODO create with user id, hash on string, add appropriate options for this dataset
	}
}

class TimeoutCheckWorker implements Runnable{
	private static final long PERIOD = Workers.MINUTES * 60 * 1000;			//Sleep for however many minutes

	@Override
	public void run(){
		for(;;){
			try{
				Thread.sleep(PERIOD);
				
				for(HashMap.Entry<String, TicketQueue> entry : Workers.ticketQueues.entrySet()){
					if(entry.getValue().timedOut(Calendar.getInstance())){
						for(Ticket ticket : entry.getValue().getQueue()){	//Put tickets back into pool
							Workers.ticketPool.get(ticket.getDatasetID()).add(ticket.getResourceName());
						}
						Workers.ticketQueues.replace(entry.getKey(), null);	//Remove this user's queue
						System.out.println("User: " + entry.getKey() + " timed out.");
					}
				}

				System.out.println("Queues checked for timeout at: " + Workers.DF.format(Calendar.getInstance().getTime()));
			}catch(InterruptedException ie){
				System.out.println("TimeoutCheckWorker experienced an interruption, now exiting.");
				break;
			}
		}
	}
}

class UserAnnotationWorker implements Runnable{
	@Override
	public void run(){
		System.out.println("E-OK");
		//TODO create with annotation confirmation information
	}
}

class DatabaseCheckWorker implements Runnable{
	private static final int MINUTES = 60;
	private static final long PERIOD =  MINUTES * 60 * 1000 / 6000;
	private static HashMap<Integer, ArrayList<String>> newQueries;

	@Override
	public void run(){
		for(;;){
			try{
				Thread.sleep(PERIOD);
				
				newQueries = DatabaseAccessor.queryNewTickets();			//Merge new queries into ticket pool
				if(newQueries != null){
					for(HashMap.Entry<Integer, ArrayList<String>> entry : newQueries.entrySet()){
						for(String name : entry.getValue()){
							Workers.ticketPool.get(entry.getKey()).add(name);
						}
					}
					newQueries = null;
				}
				System.out.println("Checked database for new data at: " + Workers.DF.format(Calendar.getInstance().getTime()));
			}catch(InterruptedException ie){
				System.out.println("DatabaseCheckWorker experienced an interruption, now exiting.");
				break;
			}
		}
	}
}

public class Workers{
	static final DateFormat DF = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
	static final int MINUTES = 15;
	static HashMap<String, TicketQueue> ticketQueues;
	static HashMap<Integer, ArrayList<String>> ticketPool;

	public static void main(String[] args){
		init();
	}

	public static void init(){
		DatabaseAccessor.refreshTicketCounts();
		ticketQueues = new HashMap<String, TicketQueue>();
		ticketPool = DatabaseAccessor.queryNewTickets();
		new Thread(new DatabaseCheckWorker()).start();
		new Thread(new TimeoutCheckWorker()).start();

		new Thread(new TicketAllocationWorker()).start();
		new Thread(new UserAnnotationWorker()).start();

		System.out.println("Threads started!");
	}
}