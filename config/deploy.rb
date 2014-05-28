#############################################################
# Application
#############################################################

set :application, "akshara"
set :deploy_to, "/var/www"

#############################################################
# Settings
#############################################################

  # set :use_sudo, true
  # default_run_options[:pty] = true

#############################################################
# Servers
#############################################################

server "182.18.164.18"

set :user, "root"
set :deploy_via, :remote_cache
set :use_sudo, true
set :rvm_ruby_string, '1.9.3'
#set :rbenv_ruby, '1.9.3'
#default_run_options[:pty] = true

#############################################################
# Git
#############################################################

set :scm, "git"
set :repo_url, "git@github.com:pykih/akshara.git"
set :branch, "master"

#############################################################
# Passenger
#############################################################

namespace :passenger do
  desc "Restart Application"  
  task :restart do  
    run "touch #{current_path}/tmp/restart.txt"  
  end
end

after :deploy, "passenger:restart"