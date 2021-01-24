class UserGamesController < ApplicationController
  def index
  end

  def show
  end

  def new
    @user_game = User_game.new()
  end

  def create
    @user_game = User_game.new(game_params)
    redirect_to edit_game_path(@user_game.game)
  end

  def update
  end

  private

  def ug_params
    params.require(:user_game).permit(:user, :game)
  end
end
