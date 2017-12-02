public class Ticket{
	private String resourceName;
	private int datasetID;

	public Ticket(String resourceName, int datasetID){
		this.resourceName = resourceName;
		this.datasetID = datasetID;
	}

	public String getResourceName(){ return this.resourceName; }
	public int getDatasetID(){ return this.datasetID; }
}