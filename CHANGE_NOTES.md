- You cannot have two routes with the same method (ie GET, POST) and the same path (ie /users). I changed the delete one to /users/delete.

- The ctx.render function would render a different template for every table. They're not all just gonna render "index". I changed that out.