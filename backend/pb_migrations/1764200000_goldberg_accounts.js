/// <reference path="../pb_data/types.d.ts" />
// Goldberg Beds — customer accounts.
// Adds phone, cart and favourites to the built-in `users` collection so a customer's
// cart and saved pieces follow them across devices, and links orders to the customer.
// Customers can only ever read or change their own account and their own orders.

migrate((app) => {
  const users = app.findCollectionByNameOrId("users");
  users.fields.add(new TextField({ name: "phone", max: 40 }));
  users.fields.add(new JSONField({ name: "cart", maxSize: 200000 }));
  users.fields.add(new JSONField({ name: "favourites", maxSize: 50000 }));
  users.listRule = "id = @request.auth.id";
  users.viewRule = "id = @request.auth.id";
  users.createRule = "";
  users.updateRule = "id = @request.auth.id";
  users.deleteRule = "id = @request.auth.id";
  app.save(users);

  const orders = app.findCollectionByNameOrId("orders");
  orders.fields.add(new RelationField({ name: "user", collectionId: users.id, maxSelect: 1, cascadeDelete: false }));
  orders.listRule = "user = @request.auth.id";
  orders.viewRule = "user = @request.auth.id";
  orders.createRule = "@request.auth.id != '' && @request.body.user = @request.auth.id && (@request.body.status = '' || @request.body.status = 'new')";
  app.save(orders);
}, (app) => {
  const orders = app.findCollectionByNameOrId("orders");
  orders.fields.removeByName("user");
  orders.listRule = null;
  orders.viewRule = null;
  orders.createRule = "@request.body.status = '' || @request.body.status = 'new'";
  app.save(orders);

  const users = app.findCollectionByNameOrId("users");
  for (const n of ["phone", "cart", "favourites"]) users.fields.removeByName(n);
  app.save(users);
});
