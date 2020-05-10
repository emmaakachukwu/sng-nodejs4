# START NG NODEJS TASK 4 - Tutoring App API Version 1

### For API testing;
###### For testing with Postman on routes marked as protected, you will have to copy the JWToken generated on login and add to your header as a header value. Header key: access-token

#### Students
##### Signup
* method: POST
* goto http://sng-nodejs4.herokuapp.com/api/v1/students/signup
* signup with full name, email and password
  * {"full_name": "<your name>", "email": "<your email>", "password": "<your password>"}

##### Login
* method: POST
* goto http://sng-nodejs4.herokuapp.com/api/v1/students/login
* Login with test account:
  * email: emmanuel@student.com
  * password: 111111
  * {"email": "<your email>", "password": "<your password>"}

#### Tutors
##### Signup
* method: POST
* goto http://sng-nodejs4.herokuapp.com/api/v1/tutors/signup
* signup with full name, email and password as in above

##### Login
* method: POST
* goto http://sng-nodejs4.herokuapp.com/api/v1/tutors/login
* Login with test account:
  * email: emmanuel@tutor.com
  * password: 111111

##### Register to tutor a subject (Protected)
* method: PATCH
* goto http://sng-nodejs4.herokuapp.com/api/v1/tutors/add-subject/<your_id>
  * E.g. goto http://sng-nodejs4.herokuapp.com/api/v1/tutors/add-subject/5eb4a923d0f6792346ef911b
* Field needed is subject tutor wishes to register as a tutor in. Subject must have been initially registered by admin as part of the available subjects
  * {"subject": "<subject_to_add>"}

#### Admin
##### Login
* method: POST
* goto http://sng-nodejs4.herokuapp.com/api/v1/admin/login
* Login with admin test account as in above:
  * email: emma@admin.com
  * password: 111111

##### Create Subject (Protected)
* method: POST
* goto http://sng-nodejs4.herokuapp.com/api/v1/admin/create-subject
* {"name": "<subject_name>", "category": "<category_id>"}
  * Test category IDs:
  * primary - 5eb5cec94589dc1bfc79ff94
  * JSS - 5eb59039eff0237bb148f78a
  * SSS - 5eb591add111fc7cc8eb77ef

##### UPDATE A SUBJECT IN A CATEGORY(BY ID) (Protected)
* method: PATCH
* goto http://sng-nodejs4.herokuapp.com/api/v1/admin/update-subject/<subject_id>
* {"name": "<subject_name>", "category": "<category_id>"}
  * Use test category IDs as shown above
  * Use test subject ID - 5eb4b41cccdda529911bea25

##### DELETE A SUBJECT IN A CATEGORY BY ID (Protected)
* method: DELETE
* goto http://sng-nodejs4.herokuapp.com/api/v1/admin/delete-subject/<subject_id>
* {"name": "<subject_name>", "category": "<category_id>"}
  * Use test category IDs and subject ID as shown above

##### RETRIEVE ALL TUTORS (Protected)
* method: GET
* goto http://sng-nodejs4.herokuapp.com/api/v1/admin/tutors

##### GET A TUTOR BY ID (Protected)
* method: GET
* goto http://sng-nodejs4.herokuapp.com/api/v1/admin/tutors/<tutor_id>
  * Test tutor ID - 5eb4a923d0f6792346ef911b

##### DEACTIVATE A TUTOR BY ID (Protected)
* method: PATCH
* goto http://sng-nodejs4.herokuapp.com/api/v1/admin/tutors/<tutor_id>
  * Test tutor ID - 5eb4a923d0f6792346ef911b

##### ADD CATEGORIES (Protected)
* method: POST
* goto http://sng-nodejs4.herokuapp.com/api/v1/admin/create-category
  * {"name": "name_of_category_to_add"}

##### UPDATE CATEGORIES (Protected)
* method: PATCH
* goto http://sng-nodejs4.herokuapp.com/api/v1/admin/update-category
  * {"name": "name_of_category_to_update", "new_name": "new_name_of_category"}

##### DELETE CATEGORIES (Protected)
* method: DELETE
* goto http://sng-nodejs4.herokuapp.com/api/v1/admin/delete-category
  * {"name": "name_of_category_to_delete"}