import pkg from 'pg';
const { Client } = pkg;

const DATABASE_URL    = "postgresql://niharikareddy_broken:1bmcNFty8AE0cyV9EH8S-g@niha-cluster-7499.g8z.gcp-us-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full"


const get_client = () => {
	return new Client(DATABASE_URL)
}


const validate_data = (data) => {
	const errors = [];

	if(!data || typeof(data) !== "object") {
		const m = "invalid data type";
		console.warn(m);
		errors.push(m);
		return {success: false, errors}
	}

	const task_name 	= 	data.task_name;
	const is_task_done 	= 	data.is_task_done

	if(!task_name || typeof(task_name) !== "string"){
		const m = "invalid taskname found";
		console.warn(m);
		errors.push(m);
		return {success: false, errors}
	}

	if((is_task_done == null || is_task_done == undefined) || typeof(is_task_done) !== "boolean"){
		const m = "invalid is_task_done type";
		console.warn(m)
		errors.push(m)
		return{success: false,errors}
	}


	return {success: true, data}
}
const validate_table = (table_name) => {
	if (!table_name ) {
        const m = "invalid table_name or table_name does not exists";
		console.warn(m)
		errors.push(m)
		return{success:false,errors}
	}
	return{success:true,table_name}
}
const gen_insert_query = (task_name,is_task_done) => {
	var query = `INSERT INTO todo_list(task_name, is_task_done) values('${task_name}',${is_task_done})`;
	return query
}
const gen_select_query = (table_name) => {
	var query = `select*from ${table_name}`;
	return query;
}
  
export const insert_data = async(data) => {
	// id:Int,task_name : string,is_taskdone:bool

	const errors = [];

	const v = validate_data(data);
	if(!v.success) return v;
	const {task_name, is_task_done} = data;
	const query = gen_insert_query(task_name,is_task_done);
	await client.connect();

	try {
		
		const results = await client.query(query);
		const d = results.rows;
		client.end();
		console.log('DATA INSERTED SUCCESSFULLY : ', d);
		return {success: true, data: d};
	} catch (err) {
		const m = "error executing query:"+ err;
		console.warn(m);
		errors.push(m);
		client.end();
		return {success: false, errors}
	} 
	

}


export const get_data = async(table_name) => {

	const errors 		= 	[] ;
	const client      	=   get_client();
	
	const v = validate_table(table_name);
	if (!v.success) return(v)
	const query = gen_select_query(table_name);
	console.log("query:",query)
	await client.connect();

	try{
		const results = await client.query(query);
		const r = results;
		client.end();
        console.log("data fetched successfully");
		console.log(r)
		return{success:true,r};
	}
	catch(err) {
		const m = "error executing the query";
		errors.push(m)
		console.warn(m)
		client.end()
		return {success: false,errors}
		
	}

	 
}