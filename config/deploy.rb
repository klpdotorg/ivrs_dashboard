# config valid only for Capistrano 3.1
lock '3.2.1'

set :application, '182.18.164.18'

# Default deploy_to directory is /var/www/my_app
set :deploy_to, '/var/www'

# Default value for :scm is :git
# set :scm, :git
set :repo_url, 'git@github.com:pykih/akshara.git'

# Default value for keep_releases is 5
set :keep_releases, 3

set :rvm_type, :system
set :default_environment, {
  'PATH' => "..../usr/local/rbenv/shims:/usr/local/rbenv/bin:$PATH"
}

namespace :deploy do

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      # Your restart mechanism here, for example:
      #execute :touch, release_path.join('tmp/restart.txt')
    end
  end

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      within release_path do
        execute "service apache2 restart"
      end
    end
  end

  desc "Symlink shared configs and folders on each release."
  task :symlink_shared do
    on roles(:app), in: :sequence, wait: 5 do      
      #execute "ln -nfs #{shared_path}/config/database.yml #{release_path}/config/database.yml"
      execute "ln -nfs #{shared_path}/assets #{release_path}/public/assets"
    end
  end
  
  desc "Sync the public/assets directory."
  task :assets do
    system "rsync -vr --exclude='.DS_Store' public/assets root@#{application}:#{shared_path}/"
  end  

  # desc "Write database settings"
  # task :update_database_settings do
  #   on roles(:app), in: :sequence, wait: 5 do
  #     #execute "ln -nfs #{current_path}/config/database.yml #{release_path}/config/database.yml"
  #     puts db_config, "#{release_path}/config/database.yml"
  #   end
  # end


  after  :publishing, :restart  
  before :publishing , 'deploy:symlink_shared'
  #before :migrate, "deploy:update_database_settings"
  
end


