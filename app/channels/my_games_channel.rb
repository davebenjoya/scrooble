class MyGamesChannel < ApplicationCable::Channel
  def subscribed
    my_games = []

    Game.all.each do |g|
      mine = false
      g.players.each do |p|
        mine = true if p.user == @current_user
      end
      my_games << g if mine == true
    end
# raise
    stream_for my_games
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
