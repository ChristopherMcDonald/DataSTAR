package workers;

public class Ticket{
	private String resourceName, datasetID;

	public Ticket(String resourceName, String datasetID){
		this.resourceName = resourceName;
		this.datasetID = datasetID;
	}

	public String getResourceName(){ return this.resourceName; }
	public String getDatasetID(){ return this.datasetID; }
}