var cursor=db.accern.find({},{"entities.ticker":true,"_id":false,"harvested_at":true,"event_source_rank":true}).limit(100);
while(cursor.hasNext()){
	print(cursor.next());
}