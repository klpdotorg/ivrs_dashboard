set :scm, "git"
set :repo_url, "git://github.com/pykih/akshara.git"
set :branch, "master"
set :keep_releases, 5

set :stages, [:production, :staging]
set :default_stage, :production

SSHKit.config.command_map[:rake]  = "bundle exec rake"
SSHKit.config.command_map[:rails] = "bundle exec rails"

# set :default_environment, {
#   'PATH' => "/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games:$PATH",
#   "RUBY_VERSION" => "ruby 1.9.3",
#   "GEM_HOME" => "/usr/local/rvm/gems/ruby-1.9.3-p545/gems",
#   "GEM_PATH" => "/usr/local/rvm/gems/ruby-1.9.3-p545/gems",
#   "BUNDLE_PATH" => "/usr/local/rvm/gems/ruby-1.9.3-p545/gems",
# }

namespace :deploy do
  desc "Tell Passenger to restart the app."
  task :restart do
    on "root@182.18.164.18" do
      execute "service apache2 restart"  
      #execute "touch #{current_path}/tmp/restart.txt"
    end
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
    on "root@182.18.164.18" do
      system "rsync -vr --exclude='.DS_Store' public/assets root@182.18.164.18:#{shared_path}/"
    end
  end
end

after :deploy, 'deploy:symlink_shared'
after :deploy, "deploy:restart"