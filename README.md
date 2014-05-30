Welcome to the akshara wiki!

App Installation Guide
========
  1. Install git
  2. Install RVM
  3. Clone repo from git@github.com:pykih/akshara.git
  4. Enable your ruby to 2.1.0 via `rvm use 2.1.0`
  5. Go into repo where you had clone the repo and type following commands to setup:
   * Change database configuration setting in config/database.yml as per your database settings.
   * `bundle install`
   * `rake db:create`
   * `rake db:migrate`
   * `rake db:seed` (only one time)

  6. Start your app by typing `rails s`
  7. Open your browser and type `localhost:3000`

Cron Process
======
There are two ways of doing it:

### Rails
Rails also provide cron process from app by using `whenever gem`
First initialize whenever `whenever .`
You can check in config/schedule.rb file. If you want to change time so you can easily change from there. runner command is use to execute script. `runner "Response.getYesterdayData` Response is name of model and table name is "responses" and action name is getYesterdayData. After all changes type this command `whenever --update-crontab` if you want to check is your setting updated in cron or not so type command `crontab -l`

###Crontab
If you want to set up cron process via cron tab use following commands:
  1. `crontab -e`
  2. Add your setting example `5 0 * * * /bin/bash -l -c 'cd /var/www/akshara && script/rails runner -e production '\''Response.getYesterdayData'\'''`

Database
======
The app is using 3 tables
  1. **responses** table update via cron after cron setting
  2. **schools** table contain all school list
  3. **questions** table contain all question name list

Deployment via Capistrano
======
  1. First run command `bundle exec rake assets:precompile RAILS_ENV='development'`
  2. Commit your all changes to git which you want to update.
  3. After commiting changes execute command `cap production deploy`

**Note** if you want to change your deployment setting there are two files. 
  1. `config/deploy/production.rb`
  2. `config/deploy.rb`

