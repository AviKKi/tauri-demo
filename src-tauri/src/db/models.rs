use crate::schema::todos;
use serde::{Serialize, Deserialize};

#[derive(Queryable, Serialize, Debug)]
pub struct Todo {
    pub id: i32,
    pub title: String,
    pub body: String,
    pub done: bool,
}


#[derive(Insertable, Serialize, Debug, Clone)]
#[table_name = "todos"]
pub struct NewTodo<'a> {
    pub title: &'a str,
    pub body: &'a str,
}