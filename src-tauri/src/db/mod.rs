extern crate dotenv;

pub mod models;
use crate::schema::*;
use diesel::prelude::*;
use dotenv::dotenv;
use models::{NewTodo, Todo};
use std::env;

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

pub fn todos_create(conn: &SqliteConnection, title: &str, body: &str) -> String {
    let new_todo = NewTodo { title, body };
    let todo = diesel::insert_into(todos::table)
        .values(&new_todo)
        .execute(conn)
        .expect("Error saving new post");
    let todo_json  =serde_json::to_string(&todo).unwrap();
    todo_json
}

pub fn todos_list(conn: &SqliteConnection) -> String {
    let all_todos = todos::dsl::todos
        .load::<Todo>(conn)
        .expect("Expect loading posts");
    let serialized = serde_json::to_string(&all_todos).unwrap();
    dbg!(all_todos);
    serialized
}

pub fn todos_toggle(conn: &SqliteConnection, qid: i32) -> String {
    use todos::dsl::{done, id};
    let t = todos::dsl::todos
        .filter(id.eq(&qid))
        .first::<Todo>(conn)
        .expect("Todo not found");
    diesel::update(todos::dsl::todos.filter(id.eq(&qid)))
        .set(done.eq(!t.done))
        .execute(conn)
        .expect("Error updating");
    let updated = todos::dsl::todos
        .filter(id.eq(&qid))
        .first::<Todo>(conn)
        .expect("Todo not found");
    serde_json::to_string(&updated).unwrap()
}

pub fn todos_delete(conn: &SqliteConnection, qid: i32) {
    use todos::dsl::{ id};
    let t = todos::dsl::todos.filter(id.eq(&qid));
    diesel::delete(t)
        .execute(conn)
        .expect("error deleting todo");
}
