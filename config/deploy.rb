set :application, "182.18.164.18"
role :app, "182.18.164.18"
role :web, "182.18.164.18"
role :db,  "182.18.164.18", :primary => true

set :user, "deploy"
set :deploy_to, "/var/www"
set :deploy_via, :remote_cache
set :use_sudo, false

set :scm, "git"
set :repo_url, "git@github.com:pykih/akshara.git"
set :branch, "master"
set :keep_releases, 5

set :default_environment, {
  'PATH' => "/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games:$PATH",
  "RUBY_VERSION" => "ruby 1.9.3",
  "GEM_HOME" => "/usr/local/lib/ruby/gems/1.9.1/gems",
  "GEM_PATH" => "/usr/local/lib/ruby/gems/1.9.1/gems",
  "BUNDLE_PATH" => "/usr/local/lib/ruby/gems/1.9.1/gems"
}

set :rvm_ruby_string, ENV['GEM_HOME'].gsub(/.*\//,"")

namespace :rvm do
  task :create_bundle_wrapper do
    
  end  
end

namespace :deploy do
  desc "Tell Passenger to restart the app."
  task :restart do
    execute "service apache2 restart"  
    execute "touch #{current_path}/tmp/restart.txt"
  end
  
  desc "Symlink shared configs and folders on each release."
  task :symlink_shared do
    on "root@182.18.164.18" do
      execute "ln -nfs #{shared_path}/config/database.yml #{release_path}/config/database.yml"
      execute "ln -nfs #{shared_path}/assets #{release_path}/public/assets"
    end  
  end
  
  
  desc "Sync the public/assets directory."
  task :assets do
    system "rsync -vr --exclude='.DS_Store' public/assets #{user}@#{application}:#{shared_path}/"
  end
end

after :deploy, 'deploy:symlink_shared'