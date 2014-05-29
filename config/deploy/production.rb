role :app, %w{root@182.18.164.18}
role :web, %w{root@182.18.164.18}
role :db,  %w{root@182.18.164.18}

server '182.18.164.18', user: 'root', roles: %w{web app db}

set :deploy_to, "/var/www"
set :deploy_via, :remote_cache
set :use_sudo, false
set :rvm_type, :system
set :rvm_ruby_version, "ruby-1.9.3-p545"
set :rvm_ruby_string, ENV['GEM_HOME'].gsub(/.*\//,"")


 set :default_env, { rvm_bin_path: "/usr/local/rvm/bin"}


set :ssh_options, {
    forward_agent: true,
    user: 'root',
}