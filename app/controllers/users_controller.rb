class UsersController < ApplicationController
  def update
    # raise
    # @user = User.find(user_params[:id])
    @user = User.find(params[:id])
    puts (@user)
    puts (params[:current_theme])
    @user.update({current_theme: params[:current_theme]})
    # @user.save!
    render json: @user
  end
end


private


  def user_params
    params.require(:user).permit(:id, :current_theme)
  end
