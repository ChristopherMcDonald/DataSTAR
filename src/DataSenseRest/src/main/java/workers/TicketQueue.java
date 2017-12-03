package workers;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

class DatasetDispatchWorker implements Runnable{
	private static int NUM_TO_ADD = 15;
	private LinkedList<Ticket> queue;

	@Override
	public void run(){
		ArrayList<Ticket> dataset;
		String previousDatasetID, datasetID;
		int idx;

		if(queue.size() > 0){
			previousDatasetID = queue.getLast().getDatasetID();
		}else{
			previousDatasetID = "-1";
		}

		datasetID = getRandomDataSet(previousDatasetID);
		dataset = Workers.ticketPool.get(datasetID);		//Randomly select a dataset
		for(int i = 0; i < NUM_TO_ADD; i++){
			if(dataset.size() == 0){
				break;
			}
			idx = ThreadLocalRandom.current().nextInt(0, dataset.size());
			queue.add(dataset.remove(idx));					//Add a batch from the ticketpool to the queue
		}
	}

	public DatasetDispatchWorker(LinkedList<Ticket> queue){
		this.queue = queue;
	}

	private String getRandomDataSet(String previousDatasetID){
		String[] ids = DatabaseAccessor.queryDatasetIDs();

		if(ids.length == 0){					//No datasets available...
			return "-1";
		}else if(ids.length == 1){				//Only one dataset available
			return ids[0];
		}

		Random r = new Random();
		int rnd;
		do{										//Go until we've found a different id
			rnd = r.nextInt(ids.length);
		}while(!ids[rnd].equals(previousDatasetID));

		return ids[rnd];
	}
}

public class TicketQueue{
	private static final int MIN_SIZE = 5;

	private LinkedList<Ticket> queue;
	private Calendar timeout;
	private int minutes;

	public TicketQueue(int minutes){
		this.minutes = minutes;

		queue = new LinkedList<Ticket>();
		new Thread(new DatasetDispatchWorker(queue)).start();
		setTimeout();
	}

	public void pop(){
		queue.pop();

		if(queue.size() <= MIN_SIZE){
			new Thread(new DatasetDispatchWorker(queue)).start();
		}
	}
	
	public Ticket peek(){
		return queue.peek();
	}

	public void setTimeout(){
		this.timeout = Calendar.getInstance();
		this.timeout.add(Calendar.MINUTE, this.minutes);
	}

	public boolean timedOut(Calendar now){
		return now.compareTo(timeout) < 0;
	}

	public LinkedList<Ticket> getQueue(){ return this.queue; }
}