# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/invitation
  def invitation
    # UserMailer.invitation



user = User.first
    # This is how you pass value to params[:user] inside mailer definition!
    UserMailer.with(user: user).invitation

  end

end
