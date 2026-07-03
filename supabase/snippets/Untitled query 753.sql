SELECT t.title , t.money ,p.name from transactions as t 
join payment_methods as p 
on t.payment_method = p.id;