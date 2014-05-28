# Define roles, user and IP address of deployment server
# role :name, %{[user]@[IP adde.]}
role :app, %w{root@182.18.164.18}
role :web, %w{root@182.18.164.18}
role :db,  %w{root@182.18.164.18}
set :stage, :production

# Define server(s)
server '182.18.164.18', user: 'root', roles: %w{web app db}

# SSH Options
# See the example commented out section in the file
# for more options.
set :ssh_options, {
    forward_agent: false,
    user: 'root',
}