# SQL Explorer frontend

This is the front-end application for the [SQL Explorer website](https://sqlexplorer.heig-vd.ch).

It's an AngularJS application that displays a website structured in three sections :

# Site structure

The site is composed of three "sections":
* The "public section" is the section on which one would land when accessing the website. It's a section where one can executes `SELECT` requests on a specific database (see [Public section](#public-section))
* The "admin section" is the section where administrators can somewhat manage the content, asssignments and questions available on the application (see [Admin section](#admin-section))
* The "assignment section" is a section that can **only be accessed through a Moodle activity**. This is where one can answer specific SQL related questions and get a grade in return (see [Assignment section](#assignment-section))

# Sections

## Public section

To change database, change the last part of the URL to the name of the database, in lower case.

For example, change the default URL `https://sqlexplorer.heig-vd.ch/#/production` to `https://sqlexplorer.heig-vd.ch/#/librairie` to got to the `Librairie` database.

The list of available databases is accessible through the [Admin section](#admin-section) or by connecting directly to the SQL Server instance.

## Admin section

To access the admin section, simply go to this URL : `https://sqlexplorer.heig-vd.ch/#/admin` _(please, never name an assignment database "Admin" as you'll have some trouble accessing it)_

You'll see a list of available databases along with some links that represents the sub-section of this admin section.

> Accesing any of the database of the sub-sections requires some credentials, that one can find in the MEI KeePass, under the `App admin user (production)` name

Clicking on...
* any database will display the list of related questions.
* the **Questions** link displays all available questions in the app, and allows one to create new assignments (see [Create new assignments](#create-new-assignments))
* the **Assignments** link displays nothing until you select an existing assignment in the dropdown list. Then it shows the questions of this assignment.

## Assignment section

To access this section, you must create a new SQL Explorer activity on Cyberlearn pointing to one of the existing assignments.

When accessing this assignment, the UI will be very similar to that of the public section, except you'll have specific questions and a grade.

## Moodle configuration

The SQL Explorer activity configuration can be found on Cyberlearn. You'll need admin privileges to access it.

Go to **Administration du site > Plugins > Modules d'activité > Outil externe > Gérer les outils**, and select the **SQL Explorer** tool to see the config.

## Create new assignments

To create new assignments, go to `https://sqlexplorer.heig-vd.ch/#/admin/questions` and click on the **New Assignment** button. You'll need to fill in:
* The name of the assignment
* The year of the assignment (usually the school year, like `2018-2019` but it's up to you ; any string will do... )
* The name of the course to which this assignment is related

When it's created, you'll find it's name in the **Assignment** dropdown list. Select it.

You can then filter the displayed questions using any of the SQL keywords or the **database** dropdown list.

Simply click the **add to assignment** link next to any question to add it to the currently selected assignment.

Nothing needs to be done when you've added all the questions needed to the assignment. Simply head over to Cyberlearn and create a new SQL Explorer activity, then select the content and you should find your new assignment.

## Add new assignment database

To add a new assignment, be sure to have those requried files:

* A `.png` file that represents your database's model (**only use lower case for the file and extension name!**)
* A `.sql` script file that creates the database and fill it with data

You'll need to `scp` the `.png` file in the correct folder on the server

```shell
# from the directory that contains the png file
$> scp databasename.png sqlexplorer@193.134.216.114:/var/www/sqlexplorer/schema_pics
```
> You'll be prompted for the `sqlexplorer` user's password. You'll find it on the MEI KeePass

Connect to the remote SQL Server directly using, for example [Azure Data Studio][azure]. The connection config is as follows:

* **Connection type**: Microsoft SQL Server
* **Server**: 193.134.216.114
* **Authentication type**: SQL Login
* **User name**: Use the `Sqlexplorer app admin` entry in the MEI KeePass
* **Password**: Use the `Sqlexplorer app admin` entry in the MEI KeePass
* **Database**: Keep `<Default>`
* **Server group**: Do as you please (this is only for Azure Data Studio internal structure)
* **Name (optional)**: It's indeed optional... do as you please

When the connection is created, open the `.sql` file on the software and click the **Run** button, then select the connection to the server.

When the database is created, you can then execute the following script:

```sql
USE <DatabaseName>;
CREATE USER [sqlexplorer] FOR LOGIN [sqlexplorer];
ALTER ROLE [db_datareader] ADD MEMBER [sqlexplorer];
GO

ALTER DATABASE <DatabaseName> SET AUTO_CLOSE OFF
GO
```
> Replace `<DatabaseName>` by the name of the database **as it appears in the creation script**

To check that the database is created and the model image is visible, simply go the `https://sqlexplorer.heig-vd.ch/#/admin` and search for your database in the list of available database

## Add new questions

To add new questions, you'll need to connect to the PostgreSQL database directly and execute `INSERT` queries, one for each of the questions to add.

> This connection will be done via SSH, so be sure to add your private key as an authorized key on the server where the database is located.

Here the config used for the SSH connection (this is a config for JetBrains DataGrip, but it should be adequate for any other software or CLI tool):

* Proxy host: 193.134.216.114
* Proxy port: 22
* Proxy user: Use the username of the `Compte droit sudo` entry in the MEI KeePass
* Auth type: Key Pair (Open SSH or PuTTY)
* Private key file: the path to your local private key file

The connection on the server should be done using these params:

* Host: localhost
* Port: 5432
* User: Use the username of the `Sqlexplorer app admin` entry in the MEI KeePass
* Password: Use the password of the `Sqlexplorer app admin` entry in the MEI KeePass
* Database: sqlexplorer

Once connected, you'll need to execute the following request to add a new question:

```sql
INSERT INTO questions (db_schema, text, sql, modified) VALUES ([The name of the database, in lowercase], [The description of the question], [The correct SQL query that answer the question], NOW());
```

[azure]: https://docs.microsoft.com/en-us/sql/azure-data-studio/download?view=sql-server-2017
