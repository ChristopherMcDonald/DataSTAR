package workers;

import java.util.ArrayList;
import java.util.HashMap;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.BufferedReader;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

class TicketWorker implements Runnable{
	private Ticket ticket;
	
	@Override
	public void run(){
		Socket socket;
		PrintWriter writer;
		String host = "localhost";
        int port = 8081;
        InetAddress address;
		
		try{
			address = InetAddress.getByName(host);
			socket = new Socket(address, port);
			
			writer = new PrintWriter(socket.getOutputStream(), true);
			if(ticket == null){
				writer.print("-1,-1");
			}else{
				writer.print(ticket.getDatasetID() + "," + ticket.getResourceName());
			}
		}catch(IOException ioe){
			ioe.printStackTrace();
		}
	}
	
	public TicketWorker(Ticket ticket){
		this.ticket = ticket;
	}
}

class RequestListenWorker implements Runnable{
	@Override
	public void run(){
		Socket socket;
		BufferedReader reader;
		String tokens[];
		String annotation;
		Ticket ticket;
		final int TIMEOUT = 15;
		
		System.out.println("RequestListenWorker started.");
		for(;;){
			try{
				socket = Workers.server.accept();
				reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
				annotation = reader.readLine();
				tokens = annotation.split(",");
				if(tokens.length == 1){						//Ticket request
					ticket = Workers.ticketQueues.get(tokens[0]).peek();
					new Thread(new TicketWorker(ticket)).start();
				}else if(tokens.length == 2){
					Workers.ticketPool.put(tokens[0], DatabaseAccessor.queryDataset(tokens[0]));
				}else if(tokens.length == 3){
					Workers.ticketQueues.put(tokens[0], new TicketQueue(TIMEOUT));
				}else{										//Annotation received
					Workers.ticketQueues.get(tokens[0]).pop();
				}
			}catch(IOException ioe){
				ioe.printStackTrace();
			}
		}
	}
}

class TimeoutCheckWorker implements Runnable{
	private static final long PERIOD = Workers.MINUTES * 60 * 1000;			//Sleep for however many minutes

	@Override
	public void run(){
		System.out.println("TimeoutCheckWorker started.");
		for(;;){
			try{
				Thread.sleep(PERIOD);
				
				for(HashMap.Entry<String, TicketQueue> entry : Workers.ticketQueues.entrySet()){
					if(entry.getValue().timedOut(Calendar.getInstance())){
						for(Ticket ticket : entry.getValue().getQueue()){	//Put tickets back into pool
							Workers.ticketPool.get(ticket.getDatasetID()).add(ticket);
						}
						Workers.ticketQueues.replace(entry.getKey(), null);	//Remove this user's queue
						System.out.println("User: " + entry.getKey() + " timed out.");
					}
				}

				System.out.println("Queues checked for timeout at: "
						+ Workers.DF.format(Calendar.getInstance().getTime()));
			}catch(InterruptedException ie){
				System.out.println("TimeoutCheckWorker experienced an interruption, now exiting.");
				break;
			}
		}
	}
}

public class Workers{
	static final DateFormat DF = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
	static final int MINUTES = 15;
	static HashMap<String, TicketQueue> ticketQueues;
	static HashMap<String, ArrayList<Ticket>> ticketPool;
	static ServerSocket server;

	public static void main(String[] args){
		init();
	}

	public static void init(){
		DatabaseAccessor.refreshTicketCounts();
		ticketQueues = new HashMap<String, TicketQueue>();
		ticketPool = DatabaseAccessor.initPool();
		
		try{
			server = new ServerSocket(8080);
			new Thread(new TimeoutCheckWorker()).start();
			new Thread(new RequestListenWorker()).start();
		}catch(IOException ioe){
			ioe.printStackTrace();
		}
	}
}