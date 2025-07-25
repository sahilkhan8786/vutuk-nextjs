import React from 'react';
import WidthCard from '@/components/ui/WidthCard';
import Title from '@/components/ui/Title';
import TeamMember, { TeamMemberProps } from './TeamMember';

const TeamContainer = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/team?limit=3`);

        if (!res.ok) {
            throw new Error('Failed to fetch team data');
        }

        const data = await res.json();
        const team: TeamMemberProps[] = data?.data?.team ?? [];

        if (team.length === 0) {
            return (
                <div className='bg-white'>
                    <WidthCard className='rounded-xl px-2 py-8'>
                        <Title heading='Meet Our Team' description='No team members found.' />
                    </WidthCard>
                </div>
            );
        }


        return (
            <div className='bg-white my-8'>
                <WidthCard className='rounded-xl px-2 py-8'>
                    <Title
                        heading='Meet Our Team'
                        description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Error deleniti velit nesciunt atque at nemo?'
                    />

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6  my-16'>
                        {/* Left column: text */}
                        <div className='flex flex-col justify-center'>
                            <h2 className='text-3xl font-semibold mb-4 text-start font-bebas mt-4 md:mt-0'>
                                Meet Our Passionate Team
                            </h2>
                            <p className='text-start text-lg leading-relaxed opacity-80'>
                                Our team is a diverse group of creative professionals dedicated to delivering
                                high-impact solutions. From designers and developers to strategists and
                                storytellers, we work together to bring your vision to life with precision and
                                purpose.
                            </p>
                        </div>


                        {/* Right column: grid of team members */}
                        <div className='flex items-center justify-center flex-col md:flex-row  gap-4 md:gap-6 '>
                            {/* <TeamMember
                                key={featuredMember._id}
                                username={featuredMember.username}
                                position={featuredMember.position}
                                image={featuredMember.image}
                                freelancerLink={featuredMember.freelancerLink}
                                facebookLink={featuredMember.facebookLink}
                                instagramLink={featuredMember.instagramLink}
                                twitterLink={featuredMember.twitterLink}
                                className='col-span-1 row-span-2'
                                /> */}

                            {team.map((member) => (
                                <TeamMember
                                    key={member._id}
                                    username={member.username}
                                    position={member.position}
                                    image={member.image}
                                    freelancerLink={member.freelancerLink}
                                    facebookLink={member.facebookLink}
                                    instagramLink={member.instagramLink}
                                    twitterLink={member.twitterLink}
                                />
                            ))}

                        </div>
                    </div>
                </WidthCard>
            </div>
        );
    } catch (error) {
        console.error('Error loading team:', error);
        return (
            <div className='bg-white'>
                <WidthCard className='rounded-xl px-2 py-8'>
                    <Title heading='Meet Our Team' description='Failed to load team data.' />
                </WidthCard>
            </div>
        );
    }
};

export default TeamContainer;
