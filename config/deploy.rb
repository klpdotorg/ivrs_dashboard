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

 set :rbenv_type, :user # or :system, depends on your rbenv setup
# set :rbenv_ruby, 'ruby-1.9.3-p545'
# set :rbenv_prefix, "RBENV_ROOT=#{fetch(:rbenv_path)} RBENV_VERSION=#{fetch(:rbenv_ruby)} #{fetch(:rbenv_path)}/bin/rbenv exec"
# set :rbenv_map_bins, %w{rake gem bundle ruby rails}
# set :rbenv_roles, :all # default value
#############################################################
# Servers
#############################################################

server "182.18.164.18"

set :user, "root"
set :deploy_via, :remote_cache
set :use_sudo, true
set :default_env, { rvm_bin_path: '~/.rvm/bin' }

#set :rvm_ruby_string, ENV['GEM_HOME'].gsub(/.*\//,"") # Read from local system

set :rvm_ruby_string, 'ruby-1.9.3-p545' # Change to your ruby version
set :rvm_type, :system # :user if RVM installed in $HOME

#set :rvm_ruby_string, :local              # use the same ruby as used locally for deployment
#set :rvm_autolibs_flag, "read-only"       # more info: rvm help autolibs


#############################################################
# Git
#############################################################

set :scm, "git"
set :repo_url, "git@github.com:pykih/akshara.git"
set :branch, "master"
set :keep_releases, 5

#############################################################
# Passenger
#############################################################


namespace :passenger do
  desc "Restart Application"  
  task :restart do
   on "root@182.18.164.18" do
      execute "service apache2 restart"  
    end
  end
end

namespace :db do
  desc "Create database yaml in shared path"
  task :configure do
    # set :database_username do
    #   "rails"
    # end
 
    # set :database_password do
    #   Capistrano::CLI.password_prompt "Database Password: "
    # end
 
    db_config = <<-EOF
      base: &base
        adapter: postgresql
        encoding: utf8
        reconnect: false
        pool: 5
        username: akshara
        password: akshara
 
      development:
        database: akshara_rails
        <<: *base
 
      test:
        database: akshara_rails
        <<: *base
 
      production:
        database: akshara_rails
        <<: *base
    EOF
   
   on "root@182.18.164.18" do
      #execute "cd /var/www && rvm use 1.9.3 && bundle install  --without=test --no-update-sources"
      execute "mkdir -p #{shared_path}/config"
    end
 
    puts db_config, "#{shared_path}/config/database.yml"
  end
 
  desc "Make symlink for database yaml"
  task :symlink do
   on "root@182.18.164.18" do
      execute "ln -nfs #{shared_path}/config/database.yml #{latest_release}/config/database.yml"
    end

  end
end
before :deploy, "db:configure"
after  :deploy, "passenger:restart", "db:symlink"
# before :deploy, 'rvm:install_rvm'  # install/update RVM
# before :deploy, 'rvm:install_ruby' # install Ruby and create gemset, OR:
