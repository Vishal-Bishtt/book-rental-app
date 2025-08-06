const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require('../prisma/client');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try{
        console.log("Google Profile: ", profile); // for debugging
        console.log("Profile ID:", profile.id);
        console.log("Profile emails:", profile.emails);
        console.log("Profile photos:", profile.photos);
        
        // Validate required data before proceeding
        if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
            console.error("No email found in Google profile");
            return done(new Error("No email found in Google profile"), null);
        }

        const email = profile.emails[0].value;
        
        // First, try to find user by Google ID
        let user = await prisma.user.findUnique({
            where: { googleId: profile.id }
        });
        console.log("User found by Google ID:", user);
        
        // If not found by Google ID, check if user exists with this email
        if (!user) {
            user = await prisma.user.findUnique({
                where: { email: email }
            });
            console.log("User found by email:", user);
            
            // If user exists with email but no Google ID, update with Google ID
            if (user) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { googleId: profile.id }
                });
                console.log("Updated existing user with Google ID:", user);
            }
        }
        
        // If still no user found, create new user
        if (!user) {
            const userData = {
                username: profile.displayName || 'Google User',
                email: email,
                googleId: profile.id,
                role: 'user'
                // password is optional for Google users
            };
            
            console.log("Creating user with data:", userData);
            
            user = await prisma.user.create({
                data: userData
            });
            
            console.log("User created successfully:", user);
        }
        
        return done(null, user);
    }
    catch (err){
        console.error("Error in Google OAuth callback:", err);
        return done(err, null);
    }
}
));

// Session handling
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try{
    const user = await prisma.user.findUnique({
        where:{id}
    });
    done(null, user);
  }catch(err){
    done(err,null);
  }
});